import { drawInteractions, drawLayers, interactions, rasterLayers } from '@/utils/map';
import bbox from '@turf/bbox';
import pointGrid from '@turf/point-grid';
import { GeoJSON } from 'ol/format';

export const RASTER_LAYERS_PROPERTIES = rasterLayers.getProperties();
export const VECTOR_LAYERS_PROPERTIES = drawLayers.getProperties();

export const DRAW_INTERACTIONS_PROPERTIES = drawInteractions.getProperties();
export const INTERACTIONS_PROPERTIES = interactions.getProperties();

export const mockPointGridWithZVal = (geoJSON: GeoJSON) => {
  const bb = bbox(geoJSON);
  // console.log({ x: bb[2] - bb[0], y: bb[3] - bb[1] });
  const points = pointGrid(bb, 1000);

  for (let i = 0; i < points.features.length; i++) {
    points.features[i].properties.z = Math.random() * 10;
  }

  return points;
};
