import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { ATTRIBUTION } from 'ol/source/OSM';
import { OPEN_TOPO_MAP_ATTRIBUTION } from './attributions';
import { OSM_TILES_SERVER_URL, OTM_TILES_SERVER_URL } from './souces';

export const OTMLayer = new TileLayer({
  preload: 0,
  source: new OSM({
    attributions: OPEN_TOPO_MAP_ATTRIBUTION,
    url: OTM_TILES_SERVER_URL,
  }),
  properties: {
    name: 'OpenTopoMap',
  },
});

export const OSMLayer = new TileLayer({
  preload: 0,
  source: new OSM({
    attributions: ATTRIBUTION,
    url: OSM_TILES_SERVER_URL,
  }),
  properties: {
    name: 'OpenStreetMap',
  },
});

export const cyclOSMLayer = new TileLayer({
  preload: 0,
  source: new OSM({
    url: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
  }),
  properties: {
    name: 'OpenCyclMap',
  },
});
