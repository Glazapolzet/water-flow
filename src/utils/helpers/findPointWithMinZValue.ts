import { featureEach } from '@turf/meta';
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const findPointWithMinZValue = (
  feature: FeatureCollection<Point>,
  options: { zProperty: string },
): Feature<Point, GeoJsonProperties> | null => {
  const { zProperty } = options;
  let minZValuePoint: Feature<Point, GeoJsonProperties> | null = null;
  let minZValue: number | null = null;

  featureEach(feature, (currentFeature) => {
    if (!currentFeature.properties || typeof currentFeature.properties[`${zProperty}`] !== 'number') {
      return;
    }

    if (minZValue === null || currentFeature.properties[`${zProperty}`] < minZValue) {
      minZValue = currentFeature.properties[`${zProperty}`];
      minZValuePoint = currentFeature;
    }
  });

  return minZValuePoint;
};
