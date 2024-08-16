import bbox from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import pointGrid from '@turf/point-grid';

export const mockPointGridWithZVal = (geoJSON: AllGeoJSON, options: { zProperty: string }) => {
  const { zProperty } = options;

  // console.log({ x: bb[2] - bb[0], y: bb[3] - bb[1] });

  const bb = bbox(geoJSON);
  const points = pointGrid(bb, 1000);

  for (let i = 0; i < points.features.length; i++) {
    if (points.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    points.features[i].properties![`${zProperty}`] = Math.random() * 10;
  }

  return points;
};
