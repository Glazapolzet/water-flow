import { propEach } from '@turf/meta';
import { FeatureCollection, Point } from 'geojson';

export const findMaxZValue = (points: FeatureCollection<Point>, options: { zProperty: string }) => {
  const { zProperty } = options;
  let maxZValue: number | null = null;

  propEach(points, (properties) => {
    if (!properties || typeof properties[`${zProperty}`] !== 'number') {
      return;
    }

    if (maxZValue === null || properties[`${zProperty}`] > maxZValue) {
      maxZValue = properties[`${zProperty}`];
    }
  });

  return maxZValue;
};
