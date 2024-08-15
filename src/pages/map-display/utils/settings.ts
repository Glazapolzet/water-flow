import { drawInteractions, rasterLayers } from '@/utils/map';

const RASTER_LAYERS_PROPERTIES = rasterLayers.getProperties();
const DRAW_INTERACTIONS_PROPERTIES = drawInteractions.getProperties();

const layerItems = Object.values(RASTER_LAYERS_PROPERTIES).map((rasterLayerProps) => {
  return {
    id: rasterLayerProps.name,
    value: rasterLayerProps.name,
    children: rasterLayerProps.name,
  };
});

const drawItems = Object.values(DRAW_INTERACTIONS_PROPERTIES).map((drawInteractionProps) => {
  return {
    id: drawInteractionProps.name,
    value: drawInteractionProps.name,
    children: drawInteractionProps.name,
  };
});

export const LAYER_SELECT_OPTIONS = [
  {
    id: 'Select layer',
    disabled: true,
    value: '',
    children: 'Select layer',
  },
  ...layerItems,
];

export const FIGURE_SELECT_OPTIONS = [
  {
    id: 'Select figure',
    disabled: true,
    value: '',
    children: 'Select figure',
  },
  {
    id: 'none',
    value: '',
    children: 'none',
  },
  ...drawItems,
];

export const ISOLINE_SELECT_OPTIONS = [
  {
    id: 'Select isoline type',
    disabled: true,
    value: '',
    children: 'Select isoline type',
  },
  {
    id: 'turf',
    value: 'turf',
    children: 'turf',
  },
  {
    id: 'conrec',
    value: 'conrec',
    children: 'CONREC',
  },
];
