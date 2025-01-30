import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { FeatureCollection, Point } from 'geojson';
import { GeoJSON } from 'ol/format';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';

import { IsolinesTypeLiteral } from '@/features/isolines';
import { clearLayerSource } from '@/features/map-tools';
import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings-panel';
import { OLBBoxLikeGeometry } from '@/types';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map-config';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

import { makeIsolines, makePointsFromBBox } from '../utils/helpers/makeIsolines';
import { ACTIVE_LAYER_OPTIONS, ISOLINES_TYPE_OPTIONS, SELECTION_AREA_OPTIONS } from '../utils/options';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const g = new GeoJSON();

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<IsolinesTypeLiteral | undefined>(undefined);
  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<OLBBoxLikeGeometry | undefined>(undefined);
  const [points, setPoints] = useState<FeatureCollection<Point> | undefined>(undefined);

  const OTMLayerName: string = rasterLayers.getProperties().OpenTopoMap.name;
  const drawLayerName: string = drawLayers.getProperties().draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  const handleDrawStart = (_drawEvent: DrawEvent) => {
    setIsDrawEnd(false);
    clearLayerSource(drawLayer);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsDrawEnd(true);

    const geometry = drawEvent?.feature.getGeometry() as OLBBoxLikeGeometry;
    setGeometry(geometry);

    //TEST
    const points = makePointsFromBBox(geometry.getExtent(), 20, { units: 'meters' });
    setPoints(points);

    drawLayer?.getSource()?.addFeatures(g.readFeatures(points));
  };

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
    layers: [drawLayer, OTMLayer],
    controls: attributionSetting,
    view: view,
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
    setIsolinesType(event.target.value as IsolinesTypeLiteral);
  };

  const handleSplineIsolinesChange = () => {
    setIsIsolinesSplined(!isIsolinesSplined);
  };

  const handleConfirmButtonClick = () => {
    if (!isolinesType || !geometry) {
      return;
    }

    clearLayerSource(drawLayer);

    makeIsolines(points, isolinesType, { isIsolinesSplined }).then((isolines) => {
      if (!isolines) {
        return;
      }

      drawLayer?.getSource()?.addFeatures(g.readFeatures(bboxPolygon(bbox(isolines))));
      drawLayer?.getSource()?.addFeatures(g.readFeatures(isolines));
    });
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
