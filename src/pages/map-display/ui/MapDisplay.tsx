import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { OLGeometryTypes, OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { GeoJSON } from 'ol/format';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { mockPointGridWithZVal } from '../utils/mockPointGrid';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isConfirmAreaButtonVisible, setConfirmAreaButtonVisible] = useState<boolean>(false);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName);

  const d = new VectorLayer({
    source: new VectorSource(),
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.0)',
      'stroke-color': 'rgba(245, 75, 66, 0.7)',
      'stroke-width': 1,
    },
    zIndex: 2,
  });

  const mapOptions = useMemo(() => {
    return {
      layers: [drawLayer, OTMLayer],
      controls: attributionSetting,
      view: view,
    };
  }, [OTMLayerName, drawLayerName]);

  const handleMapMount = useCallback((map: Map) => {
    mapRef.current = map;

    interactions.addInteractions(map, interactions.getArray());

    // map.on('click', (event) => {
    //   const clickedCoordinate = event.coordinate;
    //   console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    // });
  }, []);

  const handleLayerSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!mapRef.current) {
      return;
    }
    rasterLayers.removeLayers(mapRef.current, rasterLayers.getArray());

    if (!event.target.value || !rasterLayers.get(event.target.value)) {
      return;
    }
    const currentLayer = rasterLayers.get(event.target.value) as WebGLTileLayer;
    rasterLayers.addLayers(mapRef.current, [currentLayer]);
  };

  const handleDrawSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!mapRef.current) {
      return;
    }
    drawInteractions.removeInteractions(mapRef.current, drawInteractions.getArray());

    if (!event.target.value || !drawInteractions.get(event.target.value)) {
      return;
    }
    const currentDraw = drawInteractions.get(event.target.value) as Draw;
    drawInteractions.addInteractions(mapRef.current, [currentDraw]);

    currentDraw.on('drawstart', () => {
      setConfirmAreaButtonVisible(false);

      drawLayer?.getSource()?.clear();

      mapRef.current?.removeLayer(d);
      d.getSource()?.clear();
    });

    currentDraw.on('drawend', (event: DrawEvent) => {
      setConfirmAreaButtonVisible(true);

      const geometry = event?.feature.getGeometry() as OLGeometryTypes;
      const geojson = new GeoJSON();

      // console.log(geometry.getCoordinates()); //get bounds of figure

      const breaks = [0, 0.3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const pointGrid = mockPointGridWithZVal(geojson.writeGeometryObject(geometry), { zProperty: 'zValue' });

      const turfIsolines = makeTurfIsolines({
        pointGrid,
        breaks,
        splined: true,
        options: { zProperty: 'zValue' },
      });
      console.log({ turfIsolines });

      const conrecIsolines = makeConrecIsolines({
        pointGrid,
        breaks,
        splined: false,
        options: { zProperty: 'zValue' },
      });
      console.log({ conrecIsolines });

      drawLayer?.getSource()?.addFeatures(geojson.readFeatures(turfIsolines));

      mapRef.current?.addLayer(d);
      d.getSource()?.addFeatures(geojson.readFeatures(conrecIsolines));
    });
  };

  return (
    <section className={styles.mapDisplay}>
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
