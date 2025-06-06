import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Feature, FeatureCollection, MultiLineString, Point } from 'geojson';
import Map from 'ol/Map.js';

import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings-panel';
import {
  drawInteractions,
  drawLayer,
  erosionPointsStyle,
  flowLinesStyle,
  interactions,
  isolinesStyle,
  rasterLayers,
} from '@/utils/map-config';

import markerIcon from '@/assets/icons/map-marker.svg';
import treeIcon from '@/assets/icons/tree.svg';
import { HideableButton, Marker } from '@/components';
import { calculateErosionProtectionPoints } from '@/features/erosion-protection-points';
import { calculateFlowAccumulation, transformFlowAccumulationToFlowLines } from '@/features/flow-lines';
import { makeIsolines } from '@/features/isolines';
import { slopeParametersSelection } from '@/features/slope-parameters-selection';
import {
  addFeaturesToLayer,
  addZValueToEachPoint,
  cleanEmptyFeatures,
  findFeatureWithMaxZValue,
  findFeatureWithMinZValue,
  makeFlowLineDistanceElevationData,
  makePointsFromBBox,
  MatrixHelper,
} from '@/utils/helpers';
import { useCsvExport } from '@/utils/hooks';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { featureCollection } from '@turf/helpers';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {
  DEFAULT_SETTINGS,
  getPointsElevationData,
  MAP_BASE_CONFIG,
  SETTINGS_PANEL_CONFIG,
  useActiveLayer,
  useDrawHandlers,
  useSelectionArea,
  Z_PROPERTY_NAME,
} from '../utils';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const { exportToCsv } = useCsvExport();
  const [csvProtectionPointsData, setCsvProtectionPointsData] = useState<
    { coordinates: number[]; elevation: number; area: number[] }[]
  >([]);

  const mapRef = useRef<Map | undefined>(undefined);

  const [points, setPoints] = useState<FeatureCollection<Point> | undefined>(undefined);

  const [maxZValuePoint, setMaxZValuePoint] = useState<Feature<Point> | null>(null);
  const [minZValuePoint, setMinZValuePoint] = useState<Feature<Point> | null>(null);

  const OTMLayerName: string = rasterLayers.getProperties().OpenTopoMap.name;

  const { activeLayer, setActiveLayer } = useActiveLayer(mapRef, OTMLayerName, rasterLayers);
  const { selectionArea, setSelectionArea } = useSelectionArea(mapRef, '', drawInteractions);

  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  const [isolinesDelta, setIsolinesDelta] = useState<number>(DEFAULT_SETTINGS.isolinesDelta);
  const [pointsDelta, setPointsDelta] = useState<number>(DEFAULT_SETTINGS.pointsDelta);

  const [threshold, setThreshold] = useState<number>(DEFAULT_SETTINGS.threshold);
  const [exponent, setExponent] = useState<number>(DEFAULT_SETTINGS.exponent);
  const [minLength, setMinLength] = useState<number>(DEFAULT_SETTINGS.minLength);

  const [alpha, setAlpha] = useState<number>(DEFAULT_SETTINGS.alpha);
  const [Kt, setKt] = useState<number>(DEFAULT_SETTINGS.Kt);
  const [Km, setKm] = useState<number>(DEFAULT_SETTINGS.Km);
  const [Ke, setKe] = useState<number>(DEFAULT_SETTINGS.Ke);
  const [h, setH] = useState<number>(DEFAULT_SETTINGS.h);
  const [WLimit, setWLimit] = useState<number>(DEFAULT_SETTINGS.WLimit);

  const [Lv, setLv] = useState<number>(DEFAULT_SETTINGS.Lv);
  const [Lp, setLp] = useState<number>(DEFAULT_SETTINGS.Lp);

  const { handleDrawStart, handleDrawEnd, isDrawStart, isDrawEnd, geometry } = useDrawHandlers();

  const clearLayer = () => {
    drawLayer?.getSource()?.clear();
  };

  const clearAreaContext = () => {
    setMaxZValuePoint(null);
    setMinZValuePoint(null);

    setPoints(undefined);
  };

  useEffect(() => {
    if (isDrawStart) {
      clearLayer();
      clearAreaContext();
    }
  }, [isDrawStart]);

  useEffect(() => {
    if (isDrawEnd && geometry) {
      clearLayer();
      clearAreaContext();

      const points = makePointsFromBBox(geometry.getExtent(), pointsDelta, { units: 'meters' });

      setPoints(points);
      addFeaturesToLayer(drawLayer, points);

      return;
    }
  }, [isDrawEnd, geometry, pointsDelta]);

  useEffect(() => {
    drawInteractions.getArray().forEach((draw) => {
      draw.on('drawstart', handleDrawStart);
      draw.on('drawend', handleDrawEnd);
    });

    return () =>
      drawInteractions.getArray().forEach((draw) => {
        draw.un('drawstart', handleDrawStart);
        draw.un('drawend', handleDrawEnd);
      });
  }, []);

  const mapOptions = {
    ...MAP_BASE_CONFIG,
    layers: [drawLayer],
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));
  };

  const handleClearButtonClick = async () => {
    clearLayer();
    clearAreaContext();
  };

  const handleConfirmButtonClick = async () => {
    if (!points) {
      return;
    }

    clearLayer();

    const elevationData = await getPointsElevationData(points);
    const pointsWithZValue = addZValueToEachPoint(points, elevationData.height, { zProperty: Z_PROPERTY_NAME });

    const isolines = makeIsolines({
      points: pointsWithZValue,
      breaksDelta: isolinesDelta,
      isolinesOptions: { zProperty: Z_PROPERTY_NAME },
      splined: isIsolinesSplined,
    });

    if (!isolines) {
      return;
    }

    const cleanIsolines = featureCollection<MultiLineString>(cleanEmptyFeatures(isolines.features));

    addFeaturesToLayer(drawLayer, cleanIsolines, { style: isolinesStyle });
    addFeaturesToLayer(drawLayer, bboxPolygon(bbox(isolines)));

    const maxZValuePoint = findFeatureWithMaxZValue<Point>(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });
    const minZValuePoint = findFeatureWithMinZValue<Point>(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

    if (!maxZValuePoint || !minZValuePoint) {
      return;
    }

    const pointsMatrix = new MatrixHelper(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

    const flowAccumulation = calculateFlowAccumulation(pointsMatrix.getZmatrix(), {
      threshold: threshold,
      exponent: exponent,
    });

    const flowLines = transformFlowAccumulationToFlowLines(
      pointsMatrix.getZmatrix(),
      pointsMatrix.getXYmatrix(),
      flowAccumulation,
      {
        minLength: minLength,
      },
    );

    const { distances, elevations } = makeFlowLineDistanceElevationData(flowLines.features[0]);
    const { a, b } = slopeParametersSelection(distances, elevations);

    const erosionPoints = calculateErosionProtectionPoints(
      flowLines,
      { a, b },
      { alpha, Kt, Km, Ke, h, WLimit, Lv, Lp },
      { zProperty: Z_PROPERTY_NAME },
    );

    console.log({ erosionPoints });

    addFeaturesToLayer(drawLayer, flowLines, { style: flowLinesStyle });
    addFeaturesToLayer(drawLayer, erosionPoints, { style: erosionPointsStyle(treeIcon, 2) });

    const csvData = erosionPoints.features.map((feature) => {
      const { geometry: pointGeometry, properties } = feature;
      const [x, y] = toLonLat(pointGeometry.coordinates);
      const [startX, startY, endX, endY] = bbox(points);

      return {
        coordinates: [x, y],
        elevation: properties[`${Z_PROPERTY_NAME}`],
        area: [...toLonLat([startX, startY]), ...toLonLat([endX, endY])],
      };
    });

    setCsvProtectionPointsData(csvData);

    setMaxZValuePoint(maxZValuePoint);
    setMinZValuePoint(minZValuePoint);
  };

  return (
    <>
      <HideableButton
        colorScheme={'teal'}
        opacity={'1'}
        bgColor={'teal.200'}
        position={'absolute'}
        top={'5%'}
        right={'3%'}
        zIndex={'9999'}
        {...{
          isVisible: csvProtectionPointsData.length !== 0,
          onClick: () => exportToCsv(csvProtectionPointsData, 'protectionPoints.csv'),
        }}
      >
        Выгрузить результат
      </HideableButton>

      <Marker
        icon={markerIcon}
        mapRef={mapRef}
        position={maxZValuePoint?.geometry.coordinates}
        title={`Верхняя граница: ${maxZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}м
        Координаты: ${toStringHDMS(toLonLat(maxZValuePoint?.geometry.coordinates || []))}, ${
          maxZValuePoint?.geometry.coordinates
        }`}
      />
      <Marker
        icon={markerIcon}
        mapRef={mapRef}
        position={minZValuePoint?.geometry.coordinates}
        title={`Нижняя граница: ${minZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}м
        Координаты: ${toStringHDMS(toLonLat(minZValuePoint?.geometry.coordinates || []))}, ${
          minZValuePoint?.geometry.coordinates
        }`}
      />

      <section className={styles.mapDisplay}>
        <SettingsPanel
          title={SETTINGS_PANEL_CONFIG.title}
          mainSettings={{
            tabName: SETTINGS_PANEL_CONFIG.mainSettings.tabName,
            activeLayer: {
              ...SETTINGS_PANEL_CONFIG.mainSettings.activeLayer,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setActiveLayer(event.target.value),
              value: activeLayer,
            },
            selectionArea: {
              ...SETTINGS_PANEL_CONFIG.mainSettings.selectionArea,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setSelectionArea(event.target.value),
              value: selectionArea,
            },
            splineIsolines: {
              ...SETTINGS_PANEL_CONFIG.mainSettings.splineIsolines,
              isChecked: isIsolinesSplined,
              onChange: () => setIsIsolinesSplined(!isIsolinesSplined),
            },
            isolinesDelta: {
              ...SETTINGS_PANEL_CONFIG.mainSettings.isolinesDelta,
              onChange: (_valueAsString: string, valueAsNumber: number) => setIsolinesDelta(valueAsNumber),
            },
            pointsDelta: {
              ...SETTINGS_PANEL_CONFIG.mainSettings.pointsDelta,
              onChange: (_valueAsString: string, valueAsNumber: number) => setPointsDelta(valueAsNumber),
            },
          }}
          flowLineSettings={{
            tabName: SETTINGS_PANEL_CONFIG.flowLineSettings.tabName,
            threshold: {
              ...SETTINGS_PANEL_CONFIG.flowLineSettings.threshold,
              onChange: (_valueAsString: string, valueAsNumber: number) => setThreshold(valueAsNumber),
            },
            exponent: {
              ...SETTINGS_PANEL_CONFIG.flowLineSettings.exponent,
              onChange: (_valueAsString: string, valueAsNumber: number) => setExponent(valueAsNumber),
            },
            minLength: {
              ...SETTINGS_PANEL_CONFIG.flowLineSettings.minLength,
              onChange: (_valueAsString: string, valueAsNumber: number) => setMinLength(valueAsNumber),
            },
          }}
          wParametersSettings={{
            tabName: SETTINGS_PANEL_CONFIG.wParametersSettings.tabName,
            alpha: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.alpha,
              onChange: (_valueAsString: string, valueAsNumber: number) => setAlpha(valueAsNumber),
            },
            Kt: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.Kt,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setKt(Number(event.target.value)),
              value: Kt,
            },
            Km: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.Km,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setKm(Number(event.target.value)),
              value: Km,
            },
            Ke: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.Ke,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setKe(Number(event.target.value)),
              value: Ke,
            },
            h: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.h,
              onChange: (_valueAsString: string, valueAsNumber: number) => setH(valueAsNumber),
            },
            WLimit: {
              ...SETTINGS_PANEL_CONFIG.wParametersSettings.WLimit,
              onChange: (_valueAsString: string, valueAsNumber: number) => setWLimit(valueAsNumber),
            },
          }}
          lParametersSettings={{
            tabName: SETTINGS_PANEL_CONFIG.lParametersSettings.tabName,
            Lv: {
              ...SETTINGS_PANEL_CONFIG.lParametersSettings.Lv,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setLv(Number(event.target.value)),
              value: Lv,
            },
            Lp: {
              ...SETTINGS_PANEL_CONFIG.lParametersSettings.Lp,
              onChange: (event: ChangeEvent<HTMLSelectElement>) => setLp(Number(event.target.value)),
              value: Lp,
            },
          }}
          clearButton={{
            ...SETTINGS_PANEL_CONFIG.clearButton,
            onClick: handleClearButtonClick,
          }}
          confirmButton={{
            ...SETTINGS_PANEL_CONFIG.confirmButton,
            isVisible: !!points,
            onClick: handleConfirmButtonClick,
          }}
        />

        <OLMap containerId={'map'} options={mapOptions} onMount={handleMapMount} />
      </section>
    </>
  );
};
