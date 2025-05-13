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
    children: 'Выберите активный слой',
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
    children: 'Выберите тип области выделения',
  },
  {
    id: 'none',
    value: '',
    children: 'none',
  },
  ...selectionItems,
];

export const FLOW_LINE_SETTINGS_PANEL_CONFIG = {
  threshold: {
    title: 'Порог аккумуляции потока',
  },
  exponent: {
    title: 'Экспонента',
  },
  minLength: {
    title: 'Минимальная длина линий тока',
  },
};

export const MAIN_SETTINGS_PANEL_CONFIG = {
  activeLayer: {
    title: 'Активный слой',
    options: ACTIVE_LAYER_OPTIONS,
  },
  selectionArea: {
    title: 'Область выделения',
    options: SELECTION_AREA_OPTIONS,
  },
  splineIsolines: {
    title: 'Сглаживать изолинии',
  },
  isolinesDelta: {
    title: 'Частота изолиний (м.)',
  },
  pointsDelta: {
    title: 'Частота точек (м.)',
  },
};

export const BASE_SETTINGS_PANEL_CONFIG = {
  title: 'Настройки',
  confirmButton: {
    title: 'Рассчитать область',
  },
  clearButton: {
    title: 'Очистить область',
  },
};
