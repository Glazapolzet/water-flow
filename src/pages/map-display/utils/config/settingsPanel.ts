import { TSettingsPanel } from '@/features/settings-panel';
import { drawInteractions, rasterLayers } from '@/utils/map-config';

const activeLayerOptions = [
  {
    id: 'Select active layer',
    disabled: true,
    value: '',
    children: 'Выберите активный слой',
  },
  ...Object.values(rasterLayers.getProperties()).map((rasterLayerProps) => {
    return {
      id: rasterLayerProps.name,
      value: rasterLayerProps.name,
      children: rasterLayerProps.name,
    };
  }),
];

const selectionAreaOptions = [
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
  ...Object.values(drawInteractions.getProperties()).map((drawInteractionProps) => {
    return {
      id: drawInteractionProps.name,
      value: drawInteractionProps.name,
      children: drawInteractionProps.name,
    };
  }),
];

const KtOptions = [
  { name: 'Чернозем типичный, выщелоченный, обыкновенный', value: 1 },
  { name: 'Чернозем оподзоленный и южный, темно-серая лесная и темно-каштановая', value: 1.07 },
  { name: 'Серая лесная, каштановая', value: 1.15 },
  { name: 'Светло-серая лесная, дерново-подзолистая, светло-каштановая', value: 1.23 },
].map((option) => {
  return {
    id: option.name,
    value: option.value,
    children: option.name,
  };
});

const KmOptions = [
  { name: 'Глинистые', value: 0.9 },
  { name: 'Тяжелосуглинистые', value: 0.95 },
  { name: 'Среднесуглинистые', value: 1 },
  { name: 'Легкосуглинистые', value: 1.07 },
  { name: 'Супесчаные', value: 1.15 },
  { name: 'Песчаные', value: 1.2 },
].map((option) => {
  return {
    id: option.name,
    value: option.value,
    children: option.name,
  };
});

const KeOptions = [
  { name: 'Несмытая', value: 1 },
  { name: 'Слабосмытая', value: 1.03 },
  { name: 'Среднесмытая', value: 1.08 },
  { name: 'Сильносмытая', value: 1.14 },
  { name: 'Весьма сильносмытая', value: 1.2 },
].map((option) => {
  return {
    id: option.name,
    value: option.value,
    children: option.name,
  };
});

const LvOptions = [
  { name: 'Дп, Сл (100)', value: 100 },
  { name: 'Чв, Чоп (90)', value: 90 },
  { name: 'Чоб (60)', value: 60 },
  { name: 'Чо (50)', value: 50 },
  { name: 'Кт, К (40)', value: 40 },
  { name: 'Кс (40)', value: 40 },
].map((option) => {
  return {
    id: option.name,
    value: option.value,
    children: option.name,
  };
});

const LpOptions = [
  { name: 'Дп, Сл (600)', value: 600 },
  { name: 'Чв, Чоп (600)', value: 600 },
  { name: 'Чоб (500)', value: 500 },
  { name: 'Чо (400)', value: 400 },
  { name: 'Кт, К (350)', value: 350 },
  { name: 'Кс (250)', value: 250 },
].map((option) => {
  return {
    id: option.name,
    value: option.value,
    children: option.name,
  };
});

const MAIN_SETTINGS_TAB_CONFIG = {
  tabName: 'Основные',
  activeLayer: {
    title: 'Активный слой',
    options: activeLayerOptions,
  },
  selectionArea: {
    title: 'Область выделения',
    options: selectionAreaOptions,
  },
  splineIsolines: {
    title: 'Сглаживать изолинии',
  },
  isolinesDelta: {
    title: 'Частота изолиний (м)',
    defaultValue: 10,
    min: 10,
    step: 5,
  },
  pointsDelta: {
    title: 'Частота точек (м)',
    defaultValue: 10,
    min: 10,
    step: 5,
  },
};

const FLOW_LINE_SETTINGS_TAB_CONFIG = {
  tabName: 'Линии тока',
  threshold: {
    title: 'Порог аккумуляции потока',
    defaultValue: 0,
    min: 0,
    step: 10,
  },
  exponent: {
    title: 'Экспонента (p)',
    defaultValue: 1.1,
    min: 1,
    step: 0.1,
  },
  minLength: {
    title: 'Минимальная длина линий тока',
    defaultValue: 10,
    min: 1,
    step: 1,
  },
};

const W_PARAMETERS_SETTINGS_TAB_CONFIG = {
  tabName: 'Параметры для расчета Wт',
  alpha: {
    title: 'α',
    defaultValue: 0.0065,
    min: 0,
    step: 0.0001,
  },
  Kt: {
    title: 'Коэффициент Кт (характеризует относительную податливость почв разных типов и подтипов)',
    options: KtOptions,
  },
  Km: {
    title: 'Коэффициент Км (характеризует влияние механического состава почв на их относительную податливость эрозии)',
    options: KmOptions,
  },
  Ke: {
    title: 'Коэффициент Кэ (характеризует влияние степени смытости почвы на их относительную податливость эрозии)',
    options: KeOptions,
  },
  h: {
    title: 'Слой стока h для севооборота (мм)',
    defaultValue: 50,
    min: 0,
    step: 5,
  },
  WLimit: {
    title: 'Величина предельно допустимого среднегодового смыва W∂ (т/га)',
    defaultValue: 1.5,
    min: 0,
    step: 0.1,
  },
};

const L_PARAMETERS_SETTINGS_TAB_CONFIG = {
  tabName: 'Параметры для расчета Lмп',
  Lv: {
    title:
      'Cуммарная ширина прилегающих к верхней и нижней опушкам лесополосы участков, в пределах которых темпы восстановления почвы превышают ее смыв, м',
    options: LvOptions,
  },
  Lp: {
    title:
      'Расстояние между основными лесными полосами на территории с отсутствием эрозии и эрозией, не превышающей допустимых величин, м',
    options: LpOptions,
  },
};

export const SETTINGS_PANEL_CONFIG: TSettingsPanel = {
  title: 'Настройки',
  mainSettings: MAIN_SETTINGS_TAB_CONFIG,
  flowLineSettings: FLOW_LINE_SETTINGS_TAB_CONFIG,
  wParametersSettings: W_PARAMETERS_SETTINGS_TAB_CONFIG,
  lParametersSettings: L_PARAMETERS_SETTINGS_TAB_CONFIG,
  confirmButton: {
    title: 'Рассчитать область',
  },
  clearButton: {
    title: 'Очистить область',
  },
};

export const DEFAULT_SETTINGS = {
  isolinesDelta: SETTINGS_PANEL_CONFIG.mainSettings.isolinesDelta.defaultValue as number,
  pointsDelta: SETTINGS_PANEL_CONFIG.mainSettings.pointsDelta.defaultValue as number,
  threshold: SETTINGS_PANEL_CONFIG.flowLineSettings.threshold.defaultValue as number,
  exponent: SETTINGS_PANEL_CONFIG.flowLineSettings.exponent.defaultValue as number,
  minLength: SETTINGS_PANEL_CONFIG.flowLineSettings.minLength.defaultValue as number,
  alpha: SETTINGS_PANEL_CONFIG.wParametersSettings.alpha.defaultValue as number,
  Kt: KtOptions[0].value as number,
  Km: KmOptions[0].value as number,
  Ke: KeOptions[0].value as number,
  h: SETTINGS_PANEL_CONFIG.wParametersSettings.h.defaultValue as number,
  WLimit: SETTINGS_PANEL_CONFIG.wParametersSettings.WLimit.defaultValue as number,
  Lv: LvOptions[0].value as number,
  Lp: LpOptions[0].value as number,
};
