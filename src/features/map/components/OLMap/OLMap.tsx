import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import { useEffect } from 'react';
import styles from './OLMap.module.scss';

export const OLMap = () => {
  useEffect(() => {
    // Code here runs after the component has mounted
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });

    const map = new Map({
      //id of the div element where the map will be rendered
      target: 'map',
      layers: [osmLayer],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div id="map" className={styles.map} />
    </div>
  );
};
