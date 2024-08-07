import { Select } from '@/components';
import { OLMap } from '@/features/map';
import {
  attributionSetting,
  drawInteractions,
  drawLayer,
  interactions,
  OSMLayer,
  OTMLayer,
  OTMLayerRU,
  RASTER_LAYER_PROPERTIES,
  view,
} from '@/utils/map';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map.js';
import { toLonLat } from 'ol/proj';
import { ChangeEvent, useRef } from 'react';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './Home.module.scss';

export const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const layerGroup = new LayerGroup({ layers: [OTMLayer, OTMLayerRU, OSMLayer] });

  const drawProps = drawInteractions.getProps();
  const interactionsProps = interactions.getProps();

  console.log(drawProps);

  // polygon.setActive(false);

  const mapOptions = {
    layers: [OTMLayer, drawLayer],
    controls: attributionSetting,
    view: view,
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    drawInteractions.addInteractions(map, drawProps.polygon.name);
    interactions.addInteractions(map, Object.keys(interactionsProps));

    map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    });
  };

  const handleLayerSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    layerGroup.getLayersArray().forEach((layer) => {
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.addLayer(layer)
        : mapRef.current?.removeLayer(layer);
    });
  };

  const handleDrawSelectChange = () => {
    // console.log(polygon.getProperties());
    // const isActive = polygon.getActive();
    // polygon.setActive(!isActive);
  };

  // polygon.on('drawstart', () => {
  //   drawLayer.getSource()?.clear();
  // });

  // polygon.on('drawend', (evt) => {
  //   const polygonFeature = evt?.feature as Feature<Polygon>;

  //   console.log(polygonFeature.getGeometry()?.getCoordinates());
  // });

  return (
    <section className={styles.home}>
      <Stack align={'start'} direction={'column'} divider={<StackDivider borderColor="gray.500" />}>
        <Heading as="h2" size="lg">
          Settings
        </Heading>

        <Stack spacing={5} direction={'column'} className={styles.optionsContainer}>
          <Stack spacing={2}>
            <Heading as="h4" size="md">
              Layers
            </Heading>
            <Select
              options={LAYER_SELECT_OPTIONS}
              size={'md'}
              variant={'outline'}
              defaultValue={RASTER_LAYER_PROPERTIES.OTM.name}
              onChange={handleLayerSelectChange}
            />
          </Stack>
          <Stack spacing={2}>
            <Heading as="h4" size="md">
              Select area
            </Heading>
            <Select
              options={DRAW_SELECT_OPTIONS}
              size={'md'}
              variant={'filled'}
              defaultValue={drawProps.polygon.name}
              onChange={handleDrawSelectChange}
            />
          </Stack>
        </Stack>
      </Stack>

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
