import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { FeatureCollection, Point } from 'geojson';
import { GeoJSON } from 'ol/format';
import Map from 'ol/Map.js';

import { clearLayer } from '@/features/map-tools';
import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings-panel';
import { drawInteractions, drawLayers, interactions, rasterLayers } from '@/utils/map-config';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { addFeaturesToLayer } from '@/features/map-tools';
import { addZValueToEachPoint } from '@/utils/helpers';
import { findPointWithMaxZValue } from '@/utils/helpers/findMaxZValue';
import {
  ACTIVE_LAYER_OPTIONS,
  getMapOptions,
  getPointsElevationData,
  ISOLINES_TYPE_OPTIONS,
  SELECTION_AREA_OPTIONS,
  useDrawHandlers,
} from '../utils';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const g = new GeoJSON();

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<string | undefined>(undefined);
  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  // const [geometry, setGeometry] = useState<OLBBoxLikeGeometry | undefined>(undefined);
  const [points, setPoints] = useState<FeatureCollection<Point> | undefined>(undefined);

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

  const mapOptions = getMapOptions([drawLayer, OTMLayer]);

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

  const handleConfirmButtonClick = async () => {
    if (!isolinesType || !points) {
      return;
    }

    clearLayer(drawLayer);

    const elevationData = await getPointsElevationData(points);
    const pointsWithZValue = addZValueToEachPoint(points, elevationData.height, { zProperty: 'zValue' });

    const isolines =
      isolinesType === 'turf'
        ? makeTurfIsolines({
            points: pointsWithZValue,
            breaksDelta: 10,
            isolinesOptions: { zProperty: 'zValue' },
            splined: isIsolinesSplined,
          })
        : makeConrecIsolines({
            points: pointsWithZValue,
            breaksDelta: 10,
            isolinesOptions: { zProperty: 'zValue' },
            splined: isIsolinesSplined,
          });

    if (!isolines) {
      return;
    }

    addFeaturesToLayer(drawLayer, g.readFeatures(bboxPolygon(bbox(isolines))));
    addFeaturesToLayer(drawLayer, g.readFeatures(isolines));

    console.log({ pointsWithZValue });
    console.log({ isolines });

    const maxZValuePoint = findPointWithMaxZValue(pointsWithZValue, { zProperty: 'zValue' });
    console.log(maxZValuePoint);

    addFeaturesToLayer(drawLayer, g.readFeatures(maxZValuePoint));
  };

  return (
    <section className={styles.mapDisplay}>
      <SettingsPanel
        activeLayer={{
          heading: 'Active layer',
          defaultValue: OTMLayerName,
          options: ACTIVE_LAYER_OPTIONS,
          onChange: handleActiveLayerChange,
        }}
        isolinesType={{
          heading: 'Isolines type',
          defaultValue: '',
          options: ISOLINES_TYPE_OPTIONS,
          onChange: handleIsolinesTypeChange,
        }}
        selectionArea={{
          heading: 'Selection area type',
          defaultValue: '',
          options: SELECTION_AREA_OPTIONS,
          onChange: handleSelectionAreaChange,
        }}
        splineIsolines={{
          title: 'Spline isolines',
          isChecked: isIsolinesSplined,
          onChange: handleSplineIsolinesChange,
        }}
        confirmButton={{
          heading: 'Calculate selected area',
          isVisible: isDrawEnd && !!isolinesType,
          onClick: handleConfirmButtonClick,
        }}
      />

      <OLMap containerId={'map'} options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
