import { attributionSetting, view } from '@/utils/map-config';
import Layer from 'ol/layer/Layer';

export const getMapOptions = (layers: Layer[]) => ({
  layers: layers,
  controls: attributionSetting,
  view: view,
});
