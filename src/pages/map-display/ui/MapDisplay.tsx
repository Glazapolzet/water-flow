import { IsolinesTypeLiteral } from '@/features/isolines';
import { OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings';
import { OLBBoxLikeGeometry } from '@/types';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearLayerSource, drawIsolines } from '../utils/helpers';
import { ACTIVE_LAYER_OPTIONS, ISOLINES_TYPE_OPTIONS, SELECTION_AREA_OPTIONS } from '../utils/options';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<IsolinesTypeLiteral | undefined>(undefined);
  const [isIsolinesSplined, setIsIsolinesSplined] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<OLBBoxLikeGeometry | undefined>(undefined);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  const handleDrawStart = (_drawEvent: DrawEvent) => {
    setIsDrawEnd(false);
    clearLayerSource(drawLayer);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsDrawEnd(true);
    setGeometry(drawEvent?.feature.getGeometry() as OLBBoxLikeGeometry);
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

  const mapOptions = useMemo(() => {
    return {
      layers: [drawLayer, OTMLayer],
      controls: attributionSetting,
      view: view,
    };
  }, [OTMLayerName, drawLayerName]);

  const handleMapMount = useCallback((map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));

    // map.on('click', (event) => {
    //   const clickedCoordinate = event.coordinate;
    //   console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    // });
  }, []);

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
    drawIsolines(drawLayer, geometry, { isolinesType, isIsolinesSplined, bboxWrap: true });
    // console.log(geometry.getCoordinates()); //get bounds of figure
  };

  return (
    <section className={styles.mapDisplay}>
      <SettingsPanel
        mapRef={mapRef}
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

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
