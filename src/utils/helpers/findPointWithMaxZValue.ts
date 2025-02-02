import { featureEach } from '@turf/meta';
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const findPointWithMaxZValue = (
  feature: FeatureCollection<Point>,
  options: { zProperty: string },
): Feature<Point, GeoJsonProperties> | null => {
  const { zProperty } = options;
  let maxZValuePoint: Feature<Point, GeoJsonProperties> | null = null;
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
