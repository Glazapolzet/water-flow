import { Draw } from 'ol/interaction';
import { createBox, createRegularPolygon } from 'ol/interaction/Draw.js';

import { DrawInteractions } from '@/features/map-tools';

import { DRAW_SOURCE } from '../layers/souces';
import { styledSelection } from '../styles/styles';

const properties = {
  square: {
    name: 'square',
  },
  box: {
    name: 'box',
  },
};

const square = new Draw({
  source: DRAW_SOURCE,
  type: 'Circle',
  geometryFunction: createRegularPolygon(4, (45 * Math.PI) / 180),
  snapTolerance: 5,
  geometryName: properties.square.name,
  style: styledSelection,
});

square.setProperties(properties.square);

const box = new Draw({
  source: DRAW_SOURCE,
  type: 'Circle',
  geometryFunction: createBox(),
  snapTolerance: 5,
  geometryName: properties.box.name,
  style: styledSelection,
});

box.setProperties(properties.box);

export const drawInteractions = new DrawInteractions([square, box]);
