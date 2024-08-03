import WebGLTileLayer from 'ol/layer/WebGLTile';
import { ImageTile } from 'ol/source';
import { ATTRIBUTION } from 'ol/source/OSM';
import { OPEN_TOPO_MAP_ATTRIBUTION } from './attributions';
import { OSM_TILES_SERVER_URL, OTM_TILES_SERVER_URL } from './souces';

export const OTMLayer = new WebGLTileLayer({
  preload: 0,
  maxZoom: 17, //z coord
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: new ImageTile({
    attributions: OPEN_TOPO_MAP_ATTRIBUTION,
    url: OTM_TILES_SERVER_URL,
  }),
  properties: {
    name: 'OpenTopoMap',
  },
});

export const OSMLayer = new WebGLTileLayer({
  preload: 0,
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: new ImageTile({
    attributions: ATTRIBUTION,
    url: OSM_TILES_SERVER_URL,
  }),
  properties: {
    name: 'OpenStreetMap',
  },
});

// export const cyclOSMLayer = new WebGLTileLayer({
//   preload: 0,
//   //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
//   source: new ImageTile({
//     url: 'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
//   }),
//   properties: {
//     name: 'OpenCyclMap',
//   },
// });
