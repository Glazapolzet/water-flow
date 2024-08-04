import { OSMLayer, OTMLayer, OTMLayerRU } from './rasterLayers';

export const LAYER_SELECT_OPTIONS = [
  {
    id: 'Select layer',
    disabled: true,
    value: '',
    children: 'Select layer',
  },
  {
    id: OTMLayer.getProperties()?.name,
    value: OTMLayer.getProperties()?.name,
    children: OTMLayer.getProperties()?.name,
  },
  {
    id: OTMLayerRU.getProperties()?.name,
    value: OTMLayerRU.getProperties()?.name,
    children: OTMLayerRU.getProperties()?.name,
  },
  {
    id: OSMLayer.getProperties()?.name,
    value: OSMLayer.getProperties()?.name,
    children: OSMLayer.getProperties()?.name,
  },
];
