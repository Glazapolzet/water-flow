import { FeatureLike } from 'ol/Feature';
import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw.js';
import { StyleFunction } from 'ol/style/Style';
import { DrawInteractions } from '../helpers';
import { DRAW_VECTOR_SOURCE } from '../layers/souces';
import { DRAW_FIGURE_STYLE } from '../styles/styles';

const DRAW_INTERACTION_PROPERTIES = {
  polygon: {
    name: 'polygon',
  },
  box: {
    name: 'box',
  },
};

const styled: StyleFunction = (feature: FeatureLike) => {
  const geometryType = feature.getGeometry()?.getType();
  if (geometryType === 'Polygon' || geometryType === 'Circle' || geometryType === 'Point') {
    return DRAW_FIGURE_STYLE;
  }
};

const polygon = new Draw({
  source: DRAW_VECTOR_SOURCE,
  type: 'Polygon',
  snapTolerance: 5,
  geometryName: DRAW_INTERACTION_PROPERTIES.polygon.name,
  style: styled,
});

polygon.setProperties(DRAW_INTERACTION_PROPERTIES.polygon);

const box = new Draw({
  source: DRAW_VECTOR_SOURCE,
  type: 'Circle',
  geometryFunction: createBox(),
  snapTolerance: 5,
  geometryName: DRAW_INTERACTION_PROPERTIES.box.name,
  style: styled,
});

box.setProperties(DRAW_INTERACTION_PROPERTIES.box);

export const drawInteractions = new DrawInteractions([polygon, box]);
