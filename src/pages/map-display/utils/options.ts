import { IsolinesTypeLiteral } from '@/features/isolines';
import { drawInteractions, rasterLayers } from '@/utils/map-config';

const isolines: IsolinesTypeLiteral[] = ['turf', 'conrec'];

const isolinesItems = isolines.map((option) => {
  return {
    id: option,
    value: option,
    children: option,
  };
});

export const ISOLINES_TYPE_OPTIONS = [
  {
    id: 'Select isoline type',
    disabled: true,
    value: '',
    children: 'Select isoline type',
  },
  ...isolinesItems,
];

const layerItems = Object.values(rasterLayers.getProperties()).map((rasterLayerProps) => {
  return {
    id: rasterLayerProps.name,
    value: rasterLayerProps.name,
    children: rasterLayerProps.name,
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

const selectionItems = Object.values(drawInteractions.getProperties()).map((drawInteractionProps) => {
  return {
    id: drawInteractionProps.name,
    value: drawInteractionProps.name,
    children: drawInteractionProps.name,
  };
});

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
