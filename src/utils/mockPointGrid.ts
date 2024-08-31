import { GeoJSONBBoxLikeGeometry } from '@/types';
import bbox from '@turf/bbox';
import pointGrid from '@turf/point-grid';

export const mockPointGridWithZVal = (geoJSON: GeoJSONBBoxLikeGeometry, options: { zProperty: string }) => {
  const { zProperty } = options;

  // console.log({ x: bb[2] - bb[0], y: bb[3] - bb[1] });

  const bb = bbox(geoJSON);
  const points = pointGrid(bb, 1000);

  console.log(points);

  for (let i = 0; i < points.features.length; i++) {
    if (points.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    points.features[i].properties![`${zProperty}`] = Math.random() * 10;
  }

  return points;
};
