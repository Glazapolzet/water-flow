import { Feature, FeatureCollection } from 'geojson';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import { Style } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';

// Функция для добавления изолиний на слой
export const addFeaturesToLayer = (
  layer: VectorLayer,
  features: FeatureCollection | Feature,
  options?: { style?: Style | StyleFunction },
) => {
  const { style } = options ?? {};
  const g = new GeoJSON();
  const olFeatures = g.readFeatures(features);

  olFeatures.forEach((feature) => {
    feature.setStyle(style);
  });

  if (layer.getSource() === null) {
    return;
  }

  layer.getSource()?.addFeatures(olFeatures);
};
