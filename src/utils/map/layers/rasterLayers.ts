import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Layers } from '../helpers/Layers';
import { OSM_LAYER_SOURCE, OTM_LAYER_RU_SOURCE, OTM_LAYER_SOURCE } from './souces';

const properties = {
  OpenTopoMap: {
    name: 'OpenTopoMap',
  },
  OpenTopoMap_RU: {
    name: 'OpenTopoMap_RU',
  },
  OpenStreetMap: {
    name: 'OpenStreetMap',
  },
};

const OTMLayer = new WebGLTileLayer({
  preload: 0,
  maxZoom: 17, //z coord
  // @ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OTM_LAYER_SOURCE,
  properties: properties.OpenTopoMap,
});

const OTMLayerRU = new WebGLTileLayer({
  preload: 0,
  maxZoom: 18,
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OTM_LAYER_RU_SOURCE,
  properties: properties.OpenTopoMap_RU,
});

const OSMLayer = new WebGLTileLayer({
  preload: 0,
  maxZoom: 20,
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OSM_LAYER_SOURCE,
  properties: properties.OpenStreetMap,
});

export const rasterLayers = new Layers([OTMLayer, OTMLayerRU, OSMLayer]);
