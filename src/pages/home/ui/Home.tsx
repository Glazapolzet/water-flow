import { Select } from '@/components';
import { GeometryType, OLMap } from '@/features/map';
import { attributionSetting, drawInteractions, interactions, rasterLayers, vectorLayers, view } from '@/utils/map';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { toLonLat } from 'ol/proj';
import { ChangeEvent, useRef } from 'react';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './Home.module.scss';

export const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const OTMName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayer = vectorLayers.get(VECTOR_LAYERS_PROPERTIES.draw.name) as VectorLayer;

  const mapOptions = {
    layers: [rasterLayers.get(OTMName), drawLayer],
    controls: attributionSetting,
    view: view,
  };

  const handleMapMount = (map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));

    map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    });
  };

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

    const selectedDrawInteraction = drawInteractions.get(event.target.value) as Draw;

    drawInteractions.getArray().forEach((drawInteraction) => {
      drawInteraction.getProperties()?.name === event.target.value
        ? mapRef.current?.addInteraction(drawInteraction)
        : mapRef.current?.removeInteraction(drawInteraction);
    });

    selectedDrawInteraction.on('drawstart', () => {
      drawLayer.getSource()?.clear();
    });

    selectedDrawInteraction.on('drawend', (evt) => {
      const geometry = evt?.feature.getGeometry() as GeometryType;

      console.log(geometry.getCoordinates());
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
              defaultValue={OTMName}
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
              defaultValue={''}
              onChange={handleDrawSelectChange}
            />
          </Stack>
        </Stack>
      </Stack>

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
