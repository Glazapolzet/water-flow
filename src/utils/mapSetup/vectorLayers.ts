import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export const drawLayer = new VectorLayer({
  source: new VectorSource(),
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#000',
    'stroke-width': 2,
  },
  zIndex: 1,
});
