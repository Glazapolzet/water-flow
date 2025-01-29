import VectorLayer from 'ol/layer/Vector';

export const clearLayerSource = (layer: VectorLayer) => {
  layer?.getSource()?.clear();
};
