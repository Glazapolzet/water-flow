import VectorLayer from 'ol/layer/Vector';
import { Layers } from '../helpers/Layers';
import { DRAW_VECTOR_SOURCE } from './souces';

const VECTOR_LAYER_PROPERTIES = {
  draw: {
    name: 'draw',
  },
};

const drawLayer = new VectorLayer({
  source: DRAW_VECTOR_SOURCE,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#000',
    'stroke-width': 2,
  },
  zIndex: 1,
  properties: VECTOR_LAYER_PROPERTIES.draw,
});

export const vectorLayers = new Layers([drawLayer]);
