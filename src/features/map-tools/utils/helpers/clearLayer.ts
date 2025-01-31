import VectorLayer from 'ol/layer/Vector';

export const clearLayer = (layer: VectorLayer) => {
  layer?.getSource()?.clear();
};
