import { clone } from '@turf/clone';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const addZValueToEachPoint = (
  points: FeatureCollection<Point, GeoJsonProperties>,
  ZValues: [number | null][],
  options: { zProperty: string },
): FeatureCollection<Point, GeoJsonProperties> => {
  const { zProperty } = options;
  const pointsWithZ = clone(points);

  for (let i = 0; i < pointsWithZ.features.length; i++) {
    pointsWithZ.features[i].properties![`${zProperty}`] = ZValues[i];
  }

  return pointsWithZ;
};
