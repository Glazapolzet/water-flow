import { FeatureLike } from 'ol/Feature';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';

const selectionStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new Circle({
    radius: 4,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)',
    }),
  }),
});

export const baseStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  stroke: new Stroke({
    color: 'rgba(35, 78, 82, 0.7)',
    width: 2,
  }),
  image: new Circle({
    radius: 4,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)',
    }),
  }),
});

export const styledSelection: StyleFunction = (feature: FeatureLike) => {
  const geometryType = feature.getGeometry()?.getType();

  if (geometryType === 'Polygon' || geometryType === 'Circle' || geometryType === 'Point') {
    return selectionStyle;
  }
};
