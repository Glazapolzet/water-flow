import { Select, Stack } from '@chakra-ui/react';
import { View } from 'ol';
import { Attribution, defaults } from 'ol/control.js';
import Link from 'ol/interaction/Link';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { ChangeEvent, useEffect, useRef } from 'react';
import { cyclOSMLayer, OSMLayer, OTMLayer } from '../../utils/setup/layers';
import styles from './OLMap.module.scss';

export const OLMap = () => {
  const mapRef = useRef<Map | undefined>(undefined);
  const layerGroupRef = useRef<LayerGroup | undefined>(new LayerGroup({ layers: [OTMLayer, OSMLayer, cyclOSMLayer] }));

  useEffect(() => {
    // Code here runs after the component has mounted
    const attribution = new Attribution({
      collapsible: true,
      collapsed: true,
    });

    const map = new Map({
      //id of the div element where the map will be rendered
      target: 'map',
      layers: [OTMLayer],
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
    layerGroupRef.current?.getLayersArray().forEach((layer) => {
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.setLayers([layer])
        : mapRef.current?.removeLayer(layer);
    });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div id="map" className={styles.map} />
      </div>
      <Stack spacing={2}>
        <Select size="md" variant={'filled'} onChange={handleSelectChange}>
          <option selected disabled value="">
            Select layer
          </option>
          <option value={'OpenTopoMap'}>OpenTopoMap</option>
          <option value={'OpenStreetMap'}>OpenStreetMap</option>
          <option value={'OpenCyclMap'}>OpenCyclMap</option>
        </Select>
      </Stack>
    </>
  );
};
