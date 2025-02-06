import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Feature, FeatureCollection, Point } from 'geojson';
import Map from 'ol/Map.js';

import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings-panel';
import { drawInteractions, drawLayers, interactions, rasterLayers } from '@/utils/map-config';

import { Marker } from '@/components';
import { addZValueToEachPoint, findPointWithMinZValue } from '@/utils/helpers';
import { findPointWithMaxZValue } from '@/utils/helpers/findPointWithMaxZValue';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import {
  addIsolinesToLayer,
  getPointsElevationData,
  ISOLINES_BREAKS_DELTA,
  makeIsolines,
  MAP_BASE_CONFIG,
  SETTINGS_PANEL_BASE_CONFIG,
  useDrawHandlers,
  Z_PROPERTY_NAME,
} from '../utils';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  // const g = new GeoJSON();

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<string | undefined>(undefined);
  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  const [points, setPoints] = useState<FeatureCollection<Point> | undefined>(undefined);

  const [maxZValuePoint, setMaxZValuePoint] = useState<Feature<Point> | null>(null);
  const [minZValuePoint, setMinZValuePoint] = useState<Feature<Point> | null>(null);

  const OTMLayerName: string = rasterLayers.getProperties().OpenTopoMap.name;
  const drawLayerName: string = drawLayers.getProperties().draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName);

  if (!drawLayer || !OTMLayer) {
    return;
  }

  const { handleDrawStart, handleDrawEnd } = useDrawHandlers(drawLayer, setIsDrawEnd, setPoints);

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
    layers: [drawLayer, OTMLayer],
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));

    // map.on('click', (event) => {
    //   const clickedCoordinate = event.coordinate;
    //   console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    // });
  };

  const handleActiveLayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    rasterLayers.getArray().forEach((layer) => {
      layer.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeLayer(layer)
        : mapRef.current?.addLayer(layer);
    });
  };

  const handleSelectionAreaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    drawInteractions.getArray().forEach((draw) => {
      draw.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeInteraction(draw)
        : mapRef.current?.addInteraction(draw);
    });
  };

  const handleIsolinesTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsolinesType(event.target.value);
  };

  const handleSplineIsolinesChange = () => {
    setIsIsolinesSplined(!isIsolinesSplined);
  };

  const handleClearButtonClick = async () => {
    // mapRef.current?.getOverlays().forEach((overlay) => mapRef.current?.removeOverlay(overlay));
    drawLayer?.getSource()?.clear();
  };

  const handleConfirmButtonClick = async () => {
    if (!isolinesType || !points) {
      return;
    }

    drawLayer?.getSource()?.clear();

    const elevationData = await getPointsElevationData(points);
    const pointsWithZValue = addZValueToEachPoint(points, elevationData.height, { zProperty: Z_PROPERTY_NAME });

    const isolinesSettings = {
      points: pointsWithZValue,
      breaksDelta: ISOLINES_BREAKS_DELTA,
      isolinesOptions: { zProperty: Z_PROPERTY_NAME },
      splined: isIsolinesSplined,
    };

    const isolines = makeIsolines(isolinesType, isolinesSettings);

    if (!isolines) {
      return;
    }

    addIsolinesToLayer(drawLayer, isolines, { addBbox: true });

    drawInteractions.getArray().forEach((draw) => mapRef.current?.removeInteraction(draw));
    // console.log({ pointsWithZValue });
    // console.log({ isolines });

    const maxZValuePoint = findPointWithMaxZValue(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });
    const minZValuePoint = findPointWithMinZValue(pointsWithZValue, { zProperty: Z_PROPERTY_NAME });

    setMaxZValuePoint(maxZValuePoint);
    setMinZValuePoint(minZValuePoint);
  };

  return (
    <>
      <Marker
        mapRef={mapRef}
        position={maxZValuePoint?.geometry.coordinates}
        title={`Max height: ${maxZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}m
        Coordinates: ${toStringHDMS(toLonLat(maxZValuePoint?.geometry.coordinates || []))}`}
      />
      <Marker
        mapRef={mapRef}
        position={minZValuePoint?.geometry.coordinates}
        title={`Min height: ${minZValuePoint?.properties?.[`${Z_PROPERTY_NAME}`]}m
        Coordinates: ${toStringHDMS(toLonLat(minZValuePoint?.geometry.coordinates || []))}`}
      />

      <section className={styles.mapDisplay}>
        <SettingsPanel
          activeLayer={{
            ...SETTINGS_PANEL_BASE_CONFIG.activeLayer,
            defaultValue: OTMLayerName,
            onChange: handleActiveLayerChange,
          }}
          isolinesType={{
            ...SETTINGS_PANEL_BASE_CONFIG.isolinesType,
            defaultValue: '',
            onChange: handleIsolinesTypeChange,
          }}
          selectionArea={{
            ...SETTINGS_PANEL_BASE_CONFIG.selectionArea,
            defaultValue: '',
            onChange: handleSelectionAreaChange,
          }}
          splineIsolines={{
            ...SETTINGS_PANEL_BASE_CONFIG.splineIsolines,
            isChecked: isIsolinesSplined,
            onChange: handleSplineIsolinesChange,
          }}
          clearButton={{
            ...SETTINGS_PANEL_BASE_CONFIG.clearButton,
            isVisible: true,
            onClick: handleClearButtonClick,
          }}
          confirmButton={{
            ...SETTINGS_PANEL_BASE_CONFIG.confirmButton,
            isVisible: isDrawEnd && !!isolinesType,
            onClick: handleConfirmButtonClick,
          }}
        />

        <OLMap containerId={'map'} options={mapOptions} onMount={handleMapMount} />
      </section>
    </>
  );
};
