import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection } from 'geojson';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';

export const addIsolinesToLayer = (layer: VectorLayer, isolines: FeatureCollection, options: { addBbox?: boolean }) => {
  const g = new GeoJSON();
  const { addBbox = true } = options;

  addBbox && layer?.getSource()?.addFeatures(g.readFeatures(bboxPolygon(bbox(isolines))));
  layer?.getSource()?.addFeatures(g.readFeatures(isolines));
};
