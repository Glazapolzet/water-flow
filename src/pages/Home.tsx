import { Select } from '@/components';
import { OLMap } from '@/features/map';
import { LAYER_SELECT_OPTIONS, OSMLayer, OTMLayer } from '@/utils/mapSetup';
import { OTMLayerRU } from '@/utils/mapSetup/layers';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import { View } from 'ol';
import { Attribution, defaults } from 'ol/control.js';
import Link from 'ol/interaction/Link';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { ChangeEvent, useRef } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const layerGroup = new LayerGroup({ layers: [OTMLayer, OTMLayerRU, OSMLayer] });

  const attribution = new Attribution({
    collapsible: true,
    collapsed: true,
  });

  const mapOptions = {
    layers: [OTMLayer],
    controls: defaults({ attribution: false }).extend([attribution]),
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    }),
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    map.addInteraction(new Link());

    map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    layerGroup.getLayersArray().forEach((layer) => {
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.addLayer(layer)
        : mapRef.current?.removeLayer(layer);
    });
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
              onChange={handleSelectChange}
            />
          </Stack>
        </Stack>
      </Stack>

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};

export default Home;
