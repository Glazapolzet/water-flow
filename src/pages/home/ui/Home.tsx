import { makeTurfSplinedIsolines, OLGeometryTypes, OLMap } from '@/features/map';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { GeoJSON } from 'ol/format';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { mockPointGridWithZVal, RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
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

  // const d = new VectorLayer({
  //   source: new VectorSource(),
  //   style: {
  //     'fill-color': 'rgba(255, 255, 255, 0.0)',
  //     'stroke-color': 'rgba(245, 75, 66, 0.7)',
  //     'stroke-width': 1,
  //   },
  //   zIndex: 2,
  // });

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
      // mapRef.current?.removeLayer(d);
      // d.getSource()?.clear();
    });

    currentDrawInteraction.on('drawend', (event: DrawEvent) => {
      setConfirmAreaButtonVisible(true);

      const geometry = event?.feature.getGeometry() as OLGeometryTypes;
      const formatter = new GeoJSON();

      // console.log(geometry.getCoordinates()); //get bounds of figure

      const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const pointGrid = mockPointGridWithZVal(formatter.writeGeometryObject(geometry));

      // console.log(bbox(pointGrid));
      console.log(pointGrid);

      const splinedIsolines = makeTurfSplinedIsolines({ pointGrid, breaks, options: { zProperty: 'zValue' } });
      console.log({ splinedIsolines });

      // const conrecIsolines = makeConrecIsolines(pointGrid, { zProperty: 'zValue' });
      // console.log({ conrecIsolines });

      drawLayer
        .getSource()
        ?.addFeatures(
          formatter.readFeatures(splinedIsolines, { featureProjection: mapRef.current?.getView().getProjection() }),
        );

      console.log(drawLayer.getSource()?.getFeatures());
      // drawLayer.getSource()?.addFeatures(formatter.readFeatures(conrecIsolines));

      // mapRef.current?.addLayer(d);
      // d.getSource()?.addFeatures(splinedIsolines);
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
