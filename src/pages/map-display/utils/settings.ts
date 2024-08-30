import { IsolinesTypeLiteral } from '@/features/isolines';
import { DRAW_INTERACTIONS_PROPERTIES, RASTER_LAYERS_PROPERTIES } from './properties';

const ISOLINES_TYPE_OPTIONS: IsolinesTypeLiteral[] = ['turf', 'conrec'];

const layerItems = Object.values(RASTER_LAYERS_PROPERTIES).map((rasterLayerProps) => {
  return {
    id: rasterLayerProps.name,
    value: rasterLayerProps.name,
    children: rasterLayerProps.name,
  };
});

const selectionItems = Object.values(DRAW_INTERACTIONS_PROPERTIES).map((drawInteractionProps) => {
  return {
    id: drawInteractionProps.name,
    value: drawInteractionProps.name,
    children: drawInteractionProps.name,
  };
});

const isolinesItems = ISOLINES_TYPE_OPTIONS.map((option) => {
  return {
    id: option,
    value: option,
    children: option.toUpperCase(),
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

export const SELECTION_TYPE_SELECT_OPTIONS = [
  {
    id: 'Select selection area type',
    disabled: true,
    value: '',
    children: 'Select selection area type',
  },
  {
    id: 'none',
    value: '',
    children: 'none',
  },
  ...selectionItems,
];

export const ISOLINE_TYPE_SELECT_OPTIONS = [
  {
    id: 'Select isoline type',
    disabled: true,
    value: '',
    children: 'Select isoline type',
  },
  ...isolinesItems,
];
