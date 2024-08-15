import VectorLayer from 'ol/layer/Vector';
import { Layers } from '../helpers/Layers';
import { DRAW_VECTOR_SOURCE } from './souces';

const properties = {
  draw: {
    name: 'draw',
  },
};

const drawLayer = new VectorLayer({
  source: DRAW_VECTOR_SOURCE,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.5)',
    'stroke-color': 'rgba(35, 78, 82, 0.7)',
    'stroke-width': 2,
  },
  zIndex: 1,
  properties: properties.draw,
});

export const drawLayers = new Layers([drawLayer]);
