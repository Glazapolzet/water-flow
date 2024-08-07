import { RASTER_LAYER_PROPERTIES, drawInteractions } from '@/utils/map';
import { Draw } from 'ol/interaction';

export const LAYER_SELECT_OPTIONS = [
  {
    id: 'Select layer',
    disabled: true,
    value: '',
    children: 'Select layer',
  },
  {
    id: RASTER_LAYER_PROPERTIES.OTM.name,
    value: RASTER_LAYER_PROPERTIES.OTM.name,
    children: RASTER_LAYER_PROPERTIES.OTM.name,
  },
  {
    id: RASTER_LAYER_PROPERTIES.OTM_RU.name,
    value: RASTER_LAYER_PROPERTIES.OTM_RU.name,
    children: RASTER_LAYER_PROPERTIES.OTM_RU.name,
  },
  {
    id: RASTER_LAYER_PROPERTIES.OSM.name,
    value: RASTER_LAYER_PROPERTIES.OSM.name,
    children: RASTER_LAYER_PROPERTIES.OSM.name,
  },
];

const draws = drawInteractions.get() as Draw[];

const drawItems = draws.map((drawInteraction) => {
  return {
    id: drawInteraction.getProperties()?.name,
    value: drawInteraction.getProperties()?.name,
    children: drawInteraction.getProperties()?.name,
  };
});

export const DRAW_SELECT_OPTIONS = [
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
