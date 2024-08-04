import { Select } from '@/components';
import { OLMap } from '@/features/map';
import {
  LAYER_SELECT_OPTIONS,
  OSMLayer,
  OTMLayer,
  OTMLayerRU,
  attributionSetting,
  drawLayer,
  link,
  polygon,
  snap,
  view,
} from '@/utils/mapSetup';
import { Checkbox, Heading, Stack, StackDivider } from '@chakra-ui/react';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map.js';
import { toLonLat } from 'ol/proj';
import { ChangeEvent, useRef } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const layerGroup = new LayerGroup({ layers: [OTMLayer, OTMLayerRU, OSMLayer] });

  // The snap interaction must be added after the Modify and Draw interactions
  // in order for its map browser event handlers to be fired first. Its handlers
  // are responsible of doing the snapping.
  const interactions = [polygon, link, snap];

  const mapOptions = {
    layers: [OTMLayer, drawLayer],
    controls: attributionSetting,
    view: view,
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    interactions.forEach((interaction) => map.addInteraction(interaction));

    polygon.setActive(false);

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

  const handleDrawCheckboxChange = () => {
    const isActive = polygon.getActive();

    polygon.setActive(!isActive);
  };

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
              defaultValue={'OpenTopoMap'}
              onChange={handleLayerSelectChange}
            />
          </Stack>
          <Stack spacing={2}>
            <Heading as="h4" size="md">
              Select area
            </Heading>
            <Checkbox colorScheme="green" onChange={handleDrawCheckboxChange}>
              draw
            </Checkbox>
          </Stack>
        </Stack>
      </Stack>

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};

export default Home;
