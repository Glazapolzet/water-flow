import { Unpacked } from '@/types';
import Map from 'ol/Map.js';
import { memo, useEffect } from 'react';
import styles from './OLMap.module.scss';

interface OLMap {
  containerId: string;
  options?: Omit<Unpacked<ConstructorParameters<typeof Map>>, 'target'>;
  onMount?: (map: Map) => void; // map events and actions to perform after component mount
}

const Component = function ({ containerId, options, onMount }: OLMap) {
  const mapOptions = options ? options : {};

  useEffect(() => {
    // Code here runs after the component has mounted
    const map = new Map({
      //id of the div element where the map will be rendered
      target: containerId,
      ...mapOptions,
    });

    if (onMount) {
      onMount(map);
    }

    return () => map.setTarget(undefined);
  }, []);

  return <div id={containerId} className={styles.map} />;
};

export const OLMap = memo(Component);
