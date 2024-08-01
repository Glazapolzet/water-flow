import { Select, Stack } from '@chakra-ui/react';
import { View } from 'ol';
import { Attribution, defaults } from 'ol/control.js';
import Link from 'ol/interaction/Link';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { ATTRIBUTION } from 'ol/source/OSM';
import { ChangeEvent, useEffect, useRef } from 'react';
import { OPEN_TOPO_MAP_ATTRIBUTION } from '../../utils/setup/attributions';
import { OSM_TILES_SERVER_URL, OTM_TILES_SERVER_URL } from '../../utils/setup/souces';
import styles from './OLMap.module.scss';

export const OLMap = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  useEffect(() => {
    // Code here runs after the component has mounted
    const attribution = new Attribution({
      collapsible: true,
      collapsed: true,
    });

    const otmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM({
        attributions: OPEN_TOPO_MAP_ATTRIBUTION,
        url: OTM_TILES_SERVER_URL,
      }),
      properties: {
        name: 'OpenTopoMap',
      },
    });

    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM({
        attributions: ATTRIBUTION,
        url: OSM_TILES_SERVER_URL,
      }),
      properties: {
        name: 'OpenStreetMap',
      },
    });

    const cycleOSM = new TileLayer({
      preload: Infinity,
      source: new OSM({
        url: 'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      }),
      properties: {
        name: 'OpenCyclMap',
      },
    });

    const map = new Map({
      //id of the div element where the map will be rendered
      target: 'map',
      layers: [new LayerGroup({ layers: [otmLayer, osmLayer, cycleOSM] })],
      controls: defaults({ attribution: false }).extend([attribution]),
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    mapRef.current = map;

    map.addInteraction(new Link());

    map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    });

    return () => map.setTarget(undefined);
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    mapRef?.current
      ?.getLayerGroup()
      .getLayers()
      .getArray()
      .forEach((layer) => {
        console.log(layer);
        layer.getLayersArray().forEach((layer) => layer.setVisible(layer.getProperties()?.name === event.target.value));
      });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div id="map" className={styles.map} />
      </div>
      <Stack spacing={2}>
        <Select placeholder="Select layer" size="md" variant={'filled'} onChange={handleSelectChange}>
          <option value={'OpenTopoMap'}>OpenTopoMap</option>
          <option value={'OpenStreetMap'}>OpenStreetMap</option>
          <option value={'OpenCyclMap'}>OpenCyclMap</option>
        </Select>
      </Stack>
    </>
  );
};
