import ImageTileSource from 'ol/source/ImageTile';
import { ATTRIBUTION } from 'ol/source/OSM';
import { OPEN_TOPO_MAP_ATTRIBUTION, OPEN_TOPO_MAP_RU_ATTRIBUTION } from './attributions';

export const generateOTMServerURL = (type: 'a' | 'b' | 'c') => `https://${type}.tile.opentopomap.org/{z}/{x}/{y}.png`;
export const generateOTMRUServerURL = (type: 'a' | 'b' | 'c') => `https://tile-${type}.opentopomap.cz/{z}/{x}/{y}.png`;
export const generateOSMServerURL = () => 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const OTM_LAYER_SOURCE = new ImageTileSource({
  attributions: OPEN_TOPO_MAP_ATTRIBUTION,
  url: [generateOTMServerURL('a'), generateOTMServerURL('b'), generateOTMServerURL('c')],
  tileSize: 256,
});

export const OTM_LAYER_RU_SOURCE = new ImageTileSource({
  attributions: OPEN_TOPO_MAP_RU_ATTRIBUTION,
  url: [generateOTMRUServerURL('a'), generateOTMRUServerURL('b'), generateOTMRUServerURL('c')],
  tileSize: 256,
});

export const OSM_LAYER_SOURCE = new ImageTileSource({
  attributions: ATTRIBUTION,
  url: generateOSMServerURL(),
  tileSize: 256,
});
