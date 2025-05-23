import { FeatureLike } from 'ol/Feature';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';

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

export const styledSelection: StyleFunction = (feature: FeatureLike) => {
  const geometryType = feature.getGeometry()?.getType();

  if (geometryType === 'Polygon' || geometryType === 'Circle' || geometryType === 'Point') {
    return selectionStyle;
  }
};

export const isolinesStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(35, 78, 82, 0.7)',
    width: 2,
  }),
});

export const flowLinesStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 2,
  }),
});

export function erosionPointsStyle(
  svgSrc: string | ((feature: FeatureLike) => string),
  scale: number | ((feature: FeatureLike) => number) = 1,
  rotation: number | ((feature: FeatureLike) => number) = 0,
  anchor: [number, number] | ((feature: FeatureLike) => [number, number]) = [0.5, 0.5],
  displacement: [number, number] | ((feature: FeatureLike) => [number, number]) = [0, 0],
): StyleFunction {
  return function (feature: FeatureLike): Style {
    // Получаем URL SVG (может быть функцией или строкой)
    const src = typeof svgSrc === 'function' ? svgSrc(feature) : svgSrc;

    // Получаем параметры стиля (могут быть функциями или значениями)
    const featureScale = typeof scale === 'function' ? scale(feature) : scale;
    const featureRotation = typeof rotation === 'function' ? rotation(feature) : rotation;
    const featureAnchor = typeof anchor === 'function' ? anchor(feature) : anchor;
    const featureDisplacement = typeof displacement === 'function' ? displacement(feature) : displacement;

    return new Style({
      image: new Icon({
        src: src,
        scale: featureScale,
        rotation: featureRotation,
        anchor: featureAnchor,
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        displacement: featureDisplacement,
      }),
    });
  };
}
