import { drawInteractions, rasterLayers } from '@/utils/map-config';

const layerItems = Object.values(rasterLayers.getProperties()).map((rasterLayerProps) => {
  return {
    id: rasterLayerProps.name,
    value: rasterLayerProps.name,
    children: rasterLayerProps.name,
  };
});

const ACTIVE_LAYER_OPTIONS = [
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

const SELECTION_AREA_OPTIONS = [
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

export const SETTINGS_PANEL_BASE_CONFIG = {
  title: 'Settings',
  activeLayer: {
    title: 'Active layer',
    options: ACTIVE_LAYER_OPTIONS,
  },
  selectionArea: {
    title: 'Selection area type',
    options: SELECTION_AREA_OPTIONS,
  },
  splineIsolines: {
    title: 'Spline isolines',
  },
  isolinesDelta: {
    title: 'Isolines delta (m)',
  },
  pointsDelta: {
    title: 'Points delta (m)',
  },
  confirmButton: {
    title: 'Calculate selected area',
  },
  clearButton: {
    title: 'Clear',
  },
};
