import { IsolinesTypeLiteral } from '@/features/isolines';
import { DRAW_INTERACTIONS_PROPERTIES, RASTER_LAYERS_PROPERTIES } from './properties';

const isolines: IsolinesTypeLiteral[] = ['turf', 'conrec'];

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

const isolinesItems = isolines.map((option) => {
  return {
    id: option,
    value: option,
    children: option,
  };
});

export const ACTIVE_LAYER_OPTIONS = [
  {
    id: 'Select active layer',
    disabled: true,
    value: '',
    children: 'Select active layer',
  },
  ...layerItems,
];

export const ISOLINES_TYPE_OPTIONS = [
  {
    id: 'Select isoline type',
    disabled: true,
    value: '',
    children: 'Select isoline type',
  },
  ...isolinesItems,
];

export const SELECTION_AREA_OPTIONS = [
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
