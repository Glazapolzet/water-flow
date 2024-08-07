import WebGLTileLayer from 'ol/layer/WebGLTile';
import { OSM_LAYER_SOURCE, OTM_LAYER_RU_SOURCE, OTM_LAYER_SOURCE } from './souces';

export const RASTER_LAYER_PROPERTIES = {
  OTM: {
    name: 'OpenTopoMap',
  },
  OTM_RU: {
    name: 'OpenTopoMap_RU',
  },
  OSM: {
    name: 'OpenStreetMap',
  },
};

export const OTMLayer = new WebGLTileLayer({
  preload: 0,
  maxZoom: 15, //z coord
  // @ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OTM_LAYER_SOURCE,
  properties: RASTER_LAYER_PROPERTIES.OTM,
});

export const OTMLayerRU = new WebGLTileLayer({
  preload: 0,
  maxZoom: 18,
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OTM_LAYER_RU_SOURCE,
  properties: RASTER_LAYER_PROPERTIES.OTM_RU,
});

export const OSMLayer = new WebGLTileLayer({
  preload: 0,
  maxZoom: 20,
  //@ts-expect-error (Type 'ImageTileSource' is not assignable to type 'DataTileSource<DataTile>') but it's OK in OpenLayers spec
  source: OSM_LAYER_SOURCE,
  properties: RASTER_LAYER_PROPERTIES.OSM,
});
