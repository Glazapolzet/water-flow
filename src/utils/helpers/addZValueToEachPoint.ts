import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const addZValueToEachPoint = (
  points: FeatureCollection<Point, GeoJsonProperties>,
  ZValues: [number | null][],
  options: { zProperty: string },
) => {
  const { zProperty } = options;
  const pointsWithZ = JSON.parse(JSON.stringify(points));

  for (let i = 0; i < pointsWithZ.features.length; i++) {
    pointsWithZ.features[i].properties![`${zProperty}`] = ZValues[i];
  }

  return pointsWithZ;
};
