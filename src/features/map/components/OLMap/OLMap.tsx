import { Unpacked } from '@/types';
import Map from 'ol/Map.js';
import { FC, useEffect } from 'react';
import styles from './OLMap.module.scss';

interface OLMap {
  options?: Omit<Unpacked<ConstructorParameters<typeof Map>>, 'target'>;
  onMount?: (map: Map) => void; // map events and actions to perform after component mount
}

export const OLMap: FC<OLMap> = ({ options, onMount }) => {
  const mapOptions = options ? options : {};

  useEffect(() => {
    // Code here runs after the component has mounted
    const map = new Map({
      //id of the div element where the map will be rendered
      target: 'map',
      ...mapOptions,
    });

    if (onMount) {
      onMount(map);
    }

    return () => map.setTarget(undefined);
  });

  return <div id="map" className={styles.map} />;
};
