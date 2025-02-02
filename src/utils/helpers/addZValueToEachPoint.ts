import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const addZValueToEachPoint = (
  points: FeatureCollection<Point, GeoJsonProperties>,
  ZValues: [number | null][],
  options: { zProperty: string },
) => {
  const { zProperty } = options;
  //TODO: change this to https://turfjs.org/docs/api/clone
  const pointsWithZ = JSON.parse(JSON.stringify(points));

  for (let i = 0; i < pointsWithZ.features.length; i++) {
    pointsWithZ.features[i].properties![`${zProperty}`] = ZValues[i];
  }

  return pointsWithZ;
};
