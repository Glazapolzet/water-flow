import { propEach } from '@turf/meta';
import { FeatureCollection, Point } from 'geojson';

export const findMaxZValue = (featureCollection: FeatureCollection<Point>): number | null => {
  let maxZValue: number | null = null;

  propEach(featureCollection, (properties) => {
    if (properties && typeof properties.height === 'number') {
      if (maxZValue === null || properties.height > maxZValue) {
        maxZValue = properties.height;
      }
    }
  });

  return maxZValue;
};
