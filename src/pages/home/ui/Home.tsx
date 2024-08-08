import { OLGeometryTypes, OLMap } from '@/features/map';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import bbox from '@turf/bbox';
import isolines from '@turf/isolines';
import pointGrid from '@turf/point-grid';
import { GeoJSON } from 'ol/format';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './Home.module.scss';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';

export const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isConfirmAreaButtonVisible, setConfirmAreaButtonVisible] = useState<boolean>(false);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  // console.log(conrec.drawContour({ contourDrawer: 'shape' }));

  const mapOptions = useMemo(() => {
    return {
      layers: [OTMLayer, drawLayer],
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
      setConfirmAreaButtonVisible(false);

      drawLayer?.getSource()?.clear();
    });

    currentDrawInteraction.on('drawend', (event: DrawEvent) => {
      setConfirmAreaButtonVisible(true);

      const geometry = event?.feature.getGeometry() as OLGeometryTypes;

      const formatter = new GeoJSON();

      // const coords = geometry.getCoordinates();
      // console.log({ x: bb[2] - bb[0], y: bb[3] - bb[1] });

      const bb = bbox(formatter.writeGeometryObject(geometry));

      const points = pointGrid(bb, 1000);
      for (let i = 0; i < points.features.length; i++) {
        points.features[i].properties.z = Math.random() * 10;
      }
      const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const iso = isolines(points, breaks, { zProperty: 'z' });

      // const test = iso.features.map((feature) => feature.geometry);

      // const grid = squareGrid(bb, 10000);

      drawLayer.getSource()?.addFeatures(new GeoJSON().readFeatures(iso));

      console.log(iso);
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
