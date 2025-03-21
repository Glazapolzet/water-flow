import { addFeaturesToLayer } from '@/utils/helpers/addFeaturesToLayer';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection } from 'geojson';
import VectorLayer from 'ol/layer/Vector';
import { Style } from 'ol/style';

export const addIsolinesToLayer = (
  layer: VectorLayer,
  isolines: FeatureCollection,
  options?: { addBbox?: boolean; style?: Style },
) => {
  const { addBbox = true, style } = options ?? {};

  addBbox && addFeaturesToLayer(layer, bboxPolygon(bbox(isolines)));
  addFeaturesToLayer(layer, isolines, { style });
};
