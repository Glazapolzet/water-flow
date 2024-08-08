import { OLGeometryTypes, OLMap } from '@/features/map';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { toLonLat } from 'ol/proj';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './Home.module.scss';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';

export const Home = () => {
  const [isConfirmAreaButtonVisible, setConfirmAreaButtonVisible] = useState<boolean>(false);

  const mapRef = useRef<Map | undefined>(undefined);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  // console.log(conrec.drawContour({ contourDrawer: 'shape' }));

  const mapOptions = useMemo(() => {
    return {
      layers: [rasterLayers.get(OTMLayerName), drawLayers.get(drawLayerName)],
      controls: attributionSetting,
      view: view,
    };
  }, [OTMLayerName, drawLayerName]);

  const handleMapMount = useCallback((map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));

    map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    });
  }, []);

  const handleLayerSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    rasterLayers.getArray().forEach((layer) => {
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.addLayer(layer)
        : mapRef.current?.removeLayer(layer);
    });
  };

  const handleDrawSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!event.target.value) {
      drawInteractions.getArray().forEach((drawInteraction) => {
        mapRef.current?.removeInteraction(drawInteraction);
      });

      return;
    }

    drawInteractions.getArray().forEach((drawInteraction) => {
      drawInteraction.getProperties()?.name === event.target.value
        ? mapRef.current?.addInteraction(drawInteraction)
        : mapRef.current?.removeInteraction(drawInteraction);
    });

    const currentDrawInteraction = drawInteractions.get(event.target.value) as Draw;

    currentDrawInteraction.on('drawstart', () => {
      const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

      drawLayer?.getSource()?.clear();
      setConfirmAreaButtonVisible(false);
    });

    currentDrawInteraction.on('drawend', (event: DrawEvent) => {
      const geometry = event?.feature.getGeometry() as OLGeometryTypes;

      console.log(geometry.getCoordinates());
      setConfirmAreaButtonVisible(true);
    });
  };

  return (
    <section className={styles.home}>
      <SettingsPanel
        mapRef={mapRef}
        layerSelect={{
          defaultValue: OTMLayerName,
          options: LAYER_SELECT_OPTIONS,
          onChange: handleLayerSelectChange,
        }}
        drawSelect={{
          defaultValue: '',
          options: DRAW_SELECT_OPTIONS,
          onChange: handleDrawSelectChange,
        }}
        showConfirmAreaButton={isConfirmAreaButtonVisible}
      />
      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
