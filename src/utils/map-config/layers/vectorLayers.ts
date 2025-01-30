import VectorLayer from 'ol/layer/Vector';

import { Layers } from '@/features/map-tools';

import { baseStyle } from '../styles/styles';
import { DRAW_SOURCE } from './souces';

const properties = {
  draw: {
    name: 'draw',
  },
};

const drawLayer = new VectorLayer({
  source: DRAW_SOURCE,
  style: baseStyle,
  zIndex: 1,
  properties: properties.draw,
});

export const drawLayers = new Layers([drawLayer]);
