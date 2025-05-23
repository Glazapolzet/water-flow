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
  DEFAULT_ISOLINES_DELTA,
  DEFAULT_POINTS_DELTA,
  getPointsElevationData,
  MAP_BASE_CONFIG,
  SETTINGS_PANEL_BASE_CONFIG,
  useActiveLayer,
  useDrawHandlers,
  useSelectionArea,
  Z_PROPERTY_NAME,
} from '../utils';
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
  const [isolinesDelta, setIsolinesDelta] = useState<number>(DEFAULT_POINTS_DELTA);
  const [pointsDelta, setPointsDelta] = useState<number>(DEFAULT_POINTS_DELTA);

  const { handleDrawStart, handleDrawEnd, isDrawStart, isDrawEnd, geometry } = useDrawHandlers();

  const clearLayer = () => {
    drawLayer?.getSource()?.clear();

    setMaxZValuePoint(null);
    setMinZValuePoint(null);
  };

  useEffect(() => {
    if (isDrawStart) {
      clearLayer();
      setPoints(undefined);
    }
  }, [isDrawStart]);

  useEffect(() => {
    if (isDrawEnd && geometry) {
      clearLayer();

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

  const handleClearButtonClick = async () => {
    clearLayer();
  };

  const handleConfirmButtonClick = async () => {
    if (!points) {
      return;
    }

    clearLayer();

    const elevationData = await getPointsElevationData(points);
    const pointsWithZValue = addZValueToEachPoint(points, elevationData.height, { zProperty: Z_PROPERTY_NAME });

    const mhlpr = new MatrixHelper(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

    console.table(mhlpr.getXYmatrix());
    console.table(mhlpr.getZmatrix());

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

    const fd8FlowAccumulation = calculateFlowAccumulation(mhlpr.getZmatrix(), {
      threshold: Infinity,
      exponent: 1.1,
    });

    console.table(fd8FlowAccumulation);

    const fd8FlowLines = transformFlowAccumulationToFlowLines(
      mhlpr.getZmatrix(),
      mhlpr.getXYmatrix(),
      fd8FlowAccumulation,
      { minLength: 10 },
    );

    addFeaturesToLayer(drawLayer, fd8FlowLines, { style: flowLinesStyle });

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
          activeLayer={{
            ...SETTINGS_PANEL_BASE_CONFIG.activeLayer,
            onChange: handleActiveLayerChange,
            value: activeLayer,
          }}
          selectionArea={{
            ...SETTINGS_PANEL_BASE_CONFIG.selectionArea,
            onChange: handleSelectionAreaChange,
            value: selectionArea,
          }}
          splineIsolines={{
            ...SETTINGS_PANEL_BASE_CONFIG.splineIsolines,
            isChecked: isIsolinesSplined,
            onChange: handleSplineIsolinesChange,
          }}
          isolinesDelta={{
            ...SETTINGS_PANEL_BASE_CONFIG.isolinesDelta,
            onChange: handleIsolinesDeltaChange,
            defaultValue: DEFAULT_ISOLINES_DELTA,
            min: DEFAULT_ISOLINES_DELTA,
          }}
          pointsDelta={{
            ...SETTINGS_PANEL_BASE_CONFIG.pointsDelta,
            onChange: handlePointsDeltaChange,
            defaultValue: DEFAULT_POINTS_DELTA,
            min: DEFAULT_POINTS_DELTA,
          }}
          clearButton={{
            ...SETTINGS_PANEL_BASE_CONFIG.clearButton,
            onClick: handleClearButtonClick,
          }}
          confirmButton={{
            ...SETTINGS_PANEL_BASE_CONFIG.confirmButton,
            isVisible: !!points,
            onClick: handleConfirmButtonClick,
          }}
        />

        <OLMap containerId={'map'} options={mapOptions} onMount={handleMapMount} />
      </section>
    </>
  );
};
