import { featureEach } from '@turf/meta';
import { Feature, FeatureCollection, Point } from 'geojson';

export const findPointWithMaxZValue = (
  feature: FeatureCollection<Point>,
  options: { zProperty: string },
): Feature<Point> | null => {
  const { zProperty } = options;
  let maxZValuePoint: Feature<Point> | null = null;
  let maxZValue: number | null = null;

  featureEach(feature, (currentFeature) => {
    if (!currentFeature.properties || typeof currentFeature.properties[`${zProperty}`] !== 'number') {
      return;
    }

    if (maxZValue === null || currentFeature.properties[`${zProperty}`] > maxZValue) {
      maxZValue = currentFeature.properties[`${zProperty}`];
      maxZValuePoint = currentFeature;
    }
  });

  return maxZValuePoint;
};
