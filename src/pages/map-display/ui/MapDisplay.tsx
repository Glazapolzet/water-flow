import { OLGeometryTypes, OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearLayerSource, drawIsolines, IsolinesType } from '../utils/helpers';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { ISOLINE_TYPE_SELECT_OPTIONS, LAYER_SELECT_OPTIONS, SELECTION_TYPE_SELECT_OPTIONS } from '../utils/settings';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<IsolinesType | undefined>(undefined);
  const [isIsolinesSplined, setIsolinesSplined] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<OLGeometryTypes | undefined>(undefined);

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
    setGeometry(drawEvent?.feature.getGeometry() as OLGeometryTypes);
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

  const handleLayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    rasterLayers.getArray().forEach((layer) => {
      layer.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeLayer(layer)
        : mapRef.current?.addLayer(layer);
    });
  };

  const handleSelectionTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    drawInteractions.getArray().forEach((draw) => {
      draw.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeInteraction(draw)
        : mapRef.current?.addInteraction(draw);
    });
  };

  const handleIsolinesTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsolinesType(event.target.value as IsolinesType);
  };

  const handleSplineChange = () => {
    setIsolinesSplined(!isIsolinesSplined);
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
        layer={{
          heading: 'Active layer',
          defaultValue: OTMLayerName,
          options: LAYER_SELECT_OPTIONS,
          onChange: handleLayerChange,
        }}
        selection={{
          heading: 'Selection type',
          defaultValue: '',
          options: SELECTION_TYPE_SELECT_OPTIONS,
          onChange: handleSelectionTypeChange,
        }}
        isolines={{
          heading: 'Isoline method',
          defaultValue: '',
          options: ISOLINE_TYPE_SELECT_OPTIONS,
          onChange: handleIsolinesTypeChange,
          splineCheckbox: {
            heading: 'Spline isolines',
            onChange: handleSplineChange,
            isChecked: isIsolinesSplined,
          },
        }}
        confirmButton={{
          heading: 'Calculate selected area',
          onClick: handleConfirmButtonClick,
          isVisible: isDrawEnd && !!isolinesType,
        }}
      />

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
