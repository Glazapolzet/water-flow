import { GeoJSONBBoxLikeGeometry } from '@/types';
import bbox from '@turf/bbox';
import pointGrid from '@turf/point-grid';

export const makeMockPointsWithZ = (geoJSON: GeoJSONBBoxLikeGeometry, options: { zProperty: string }) => {
  const { zProperty } = options;

  const bb = bbox(geoJSON);
  const points = pointGrid(bb, 1000);

  console.log(points.features);

  for (let i = 0; i < points.features.length; i++) {
    if (points.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    points.features[i].properties![`${zProperty}`] = Math.random() * 3000;
  }

  return points;
};
