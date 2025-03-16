import { FeatureCollection } from 'geojson';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import { Stroke, Style } from 'ol/style';

// Функция для добавления изолиний на слой
export const addFeaturesToLayer = (
  layer: VectorLayer,
  featureCollection: FeatureCollection,
  options?: { color?: string; width?: number },
) => {
  const g = new GeoJSON();
  const { color = 'red', width = 2 } = options || {};
  const olFeatures = g.readFeatures(featureCollection);

  const style = new Style({
    stroke: new Stroke({
      color,
      width,
    }),
  });

  olFeatures.forEach((feature) => {
    feature.setStyle(style);
  });

  if (layer.getSource() === null) {
    return;
  }

  layer.getSource()?.addFeatures(olFeatures);
};
