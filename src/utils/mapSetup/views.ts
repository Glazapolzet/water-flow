import { View } from 'ol';
import { fromLonLat } from 'ol/proj';

export const view = new View({
  center: fromLonLat([0, 0]),
  zoom: 2,
});
