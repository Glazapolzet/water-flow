import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';

export const addFeaturesToLayer = (layer: VectorLayer, features: Feature<Geometry>[]) => {
  layer?.getSource()?.addFeatures(features);
};
