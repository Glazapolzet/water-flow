import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Feature, FeatureCollection, MultiLineString, Point } from 'geojson';
import Map from 'ol/Map.js';

import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings-panel';
import {
  drawInteractions,
  drawLayer,
  flowLinesStyle,
  interactions,
  isolinesStyle,
  rasterLayers,
} from '@/utils/map-config';

import { Marker } from '@/components';
import { calculateFlowAccumulation, transformFlowAccumulationToFlowLines } from '@/features/flow-lines';
import { makeIsolines } from '@/features/isolines';
import {
  addFeaturesToLayer,
  addZValueToEachPoint,
  cleanEmptyFeatures,
  findFeatureWithMaxZValue,
  findFeatureWithMinZValue,
  makePointsFromBBox,
  MatrixHelper,
} from '@/utils/helpers';
import { featureCollection } from '@turf/helpers';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {
  addIsolinesToLayer,
  BASE_SETTINGS_PANEL_CONFIG,
  DEFAULT_EXPONENT,
  DEFAULT_ISOLINES_DELTA,
  DEFAULT_MIN_LENGTH,
  DEFAULT_POINTS_DELTA,
  DEFAULT_THRESHOLD,
  getPointsElevationData,
  MAIN_SETTINGS_PANEL_CONFIG,
  MAP_BASE_CONFIG,
  useActiveLayer,
  useDrawHandlers,
  useSelectionArea,
  Z_PROPERTY_NAME,
} from '../utils';
import { FLOW_LINE_SETTINGS_PANEL_CONFIG } from '../utils/config/settingsPanel';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [points, setPoints] = useState<FeatureCollection<Point> | undefined>(undefined);

  const [maxZValuePoint, setMaxZValuePoint] = useState<Feature<Point> | null>(null);
  const [minZValuePoint, setMinZValuePoint] = useState<Feature<Point> | null>(null);

  const OTMLayerName: string = rasterLayers.getProperties().OpenTopoMap.name;

  const { activeLayer, setActiveLayer } = useActiveLayer(mapRef, OTMLayerName, rasterLayers);
  const { selectionArea, setSelectionArea } = useSelectionArea(mapRef, '', drawInteractions);

  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  const [isolinesDelta, setIsolinesDelta] = useState<number>(DEFAULT_ISOLINES_DELTA);
  const [pointsDelta, setPointsDelta] = useState<number>(DEFAULT_POINTS_DELTA);

  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const [exponent, setExponent] = useState<number>(DEFAULT_EXPONENT);
  const [minLength, setMinLength] = useState<number>(DEFAULT_MIN_LENGTH);

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

    // map.on('click', (event) => {
    //   const clickedCoordinate = event.coordinate;
    //   console.log('Clicked Coordinate:', clickedCoordinate);
    // });
  };

  const handleActiveLayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setActiveLayer(event.target.value);
  };

  const handleSelectionAreaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectionArea(event.target.value);
  };

  const handleIsolinesDeltaChange = (_valueAsString: string, valueAsNumber: number) => {
    setIsolinesDelta(valueAsNumber);
  };

  const handlePointsDeltaChange = (_valueAsString: string, valueAsNumber: number) => {
    setPointsDelta(valueAsNumber);
  };

  const handleSplineIsolinesChange = () => {
    setIsIsolinesSplined(!isIsolinesSplined);
  };

  const handleThresholdChange = (_valueAsString: string, valueAsNumber: number) => {
    setThreshold(valueAsNumber);
  };

  const handleExponentChange = (_valueAsString: string, valueAsNumber: number) => {
    setExponent(valueAsNumber);
  };

  const handleMinLengthChange = (_valueAsString: string, valueAsNumber: number) => {
    setMinLength(valueAsNumber);
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

    const mhlpr = new MatrixHelper(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

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

    addIsolinesToLayer(drawLayer, cleanIsolines, { addBbox: true, style: isolinesStyle });

    const maxZValuePoint = findFeatureWithMaxZValue<Point>(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });
    const minZValuePoint = findFeatureWithMinZValue<Point>(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

    if (!maxZValuePoint || !minZValuePoint) {
      return;
    }

    const flowAccumulation = calculateFlowAccumulation(mhlpr.getZmatrix(), {
      threshold: threshold,
      exponent: exponent,
    });

    // console.table(mhlpr.getXYmatrix());
    // console.table(mhlpr.getZmatrix());
    // console.table(flowAccumulation);

    const flowLines = transformFlowAccumulationToFlowLines(mhlpr.getZmatrix(), mhlpr.getXYmatrix(), flowAccumulation, {
      minLength: minLength,
    });

    console.log(flowLines);

    // console.log(distance([0, 0], [1, 1]));

    addFeaturesToLayer(drawLayer, flowLines, { style: flowLinesStyle });

    setMaxZValuePoint(maxZValuePoint);
    setMinZValuePoint(minZValuePoint);
  };

  return (
    <>
      <Marker
        mapRef={mapRef}
        position={maxZValuePoint?.geometry.coordinates}
        title={`Верхняя граница: ${maxZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}м
        Координаты: ${toStringHDMS(toLonLat(maxZValuePoint?.geometry.coordinates || []))}, ${
          maxZValuePoint?.geometry.coordinates
        }`}
      />
      <Marker
        mapRef={mapRef}
        position={minZValuePoint?.geometry.coordinates}
        title={`Нижняя граница: ${minZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}м
        Координаты: ${toStringHDMS(toLonLat(minZValuePoint?.geometry.coordinates || []))}, ${
          minZValuePoint?.geometry.coordinates
        }`}
      />

      <section className={styles.mapDisplay}>
        <SettingsPanel
          title={BASE_SETTINGS_PANEL_CONFIG.title}
          mainSettings={{
            activeLayer: {
              ...MAIN_SETTINGS_PANEL_CONFIG.activeLayer,
              onChange: handleActiveLayerChange,
              value: activeLayer,
            },
            selectionArea: {
              ...MAIN_SETTINGS_PANEL_CONFIG.selectionArea,
              onChange: handleSelectionAreaChange,
              value: selectionArea,
            },
            splineIsolines: {
              ...MAIN_SETTINGS_PANEL_CONFIG.splineIsolines,
              isChecked: isIsolinesSplined,
              onChange: handleSplineIsolinesChange,
            },
            isolinesDelta: {
              ...MAIN_SETTINGS_PANEL_CONFIG.isolinesDelta,
              onChange: handleIsolinesDeltaChange,
              defaultValue: DEFAULT_ISOLINES_DELTA,
              min: DEFAULT_ISOLINES_DELTA,
              step: 5,
            },
            pointsDelta: {
              ...MAIN_SETTINGS_PANEL_CONFIG.pointsDelta,
              onChange: handlePointsDeltaChange,
              defaultValue: DEFAULT_POINTS_DELTA,
              min: DEFAULT_POINTS_DELTA,
              step: 5,
            },
          }}
          flowLineSettings={{
            threshold: {
              ...FLOW_LINE_SETTINGS_PANEL_CONFIG.threshold,
              onChange: handleThresholdChange,
              defaultValue: DEFAULT_THRESHOLD,
              min: DEFAULT_THRESHOLD,
              step: 10,
            },
            exponent: {
              ...FLOW_LINE_SETTINGS_PANEL_CONFIG.exponent,
              onChange: handleExponentChange,
              defaultValue: DEFAULT_EXPONENT,
              min: 1,
              step: 0.1,
            },
            minLength: {
              ...FLOW_LINE_SETTINGS_PANEL_CONFIG.minLength,
              onChange: handleMinLengthChange,
              defaultValue: DEFAULT_MIN_LENGTH,
              min: 1,
              step: 1,
            },
          }}
          clearButton={{
            ...BASE_SETTINGS_PANEL_CONFIG.clearButton,
            onClick: handleClearButtonClick,
          }}
          confirmButton={{
            ...BASE_SETTINGS_PANEL_CONFIG.confirmButton,
            isVisible: !!points,
            onClick: handleConfirmButtonClick,
          }}
        />

        <OLMap containerId={'map'} options={mapOptions} onMount={handleMapMount} />
      </section>
    </>
  );
};
