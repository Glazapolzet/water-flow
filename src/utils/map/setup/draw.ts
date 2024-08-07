import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw.js';
import { DrawInteractions } from '../helpers';
import { DRAW_VECTOR_SOURCE } from '../layers/souces';

const DRAW_INTERACTION_PROPERTIES = {
  polygon: {
    name: 'polygon',
  },
  box: {
    name: 'box',
  },
};

const polygon = new Draw({
  source: DRAW_VECTOR_SOURCE,
  type: 'Polygon',
  snapTolerance: 5,
  geometryName: DRAW_INTERACTION_PROPERTIES.polygon.name,
});

polygon.setProperties(DRAW_INTERACTION_PROPERTIES.polygon);

const box = new Draw({
  source: DRAW_VECTOR_SOURCE,
  type: 'Circle',
  geometryFunction: createBox(),
  snapTolerance: 5,
  geometryName: DRAW_INTERACTION_PROPERTIES.box.name,
});

box.setProperties(DRAW_INTERACTION_PROPERTIES.box);

export const drawInteractions = new DrawInteractions([polygon, box]);
