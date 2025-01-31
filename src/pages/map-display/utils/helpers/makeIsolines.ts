import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

import { vallhalaApi } from '@/api/valhalla';
import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { makeValhallaMappings, transformXYToLonLat } from '@/utils/helpers';
import { coordAll } from '@turf/meta';

const getPointsElevationData = async (points: FeatureCollection<Point, GeoJsonProperties>) => {
  const coordinates = transformXYToLonLat(coordAll(points));
  const mappedData = makeValhallaMappings(coordinates);

  return await vallhalaApi.getElevation(mappedData);
};

const addZValuesToPoints = (
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

export const makeIsolines = async (
  points: FeatureCollection<Point>,
  isolinesType: string,
  options?: {
    zProperty?: string;
    isIsolinesSplined?: boolean;
  },
) => {
  const { zProperty = 'zValue', isIsolinesSplined = false } = options ?? {};

  const elevationData = await getPointsElevationData(points);
  const pointsWithZ = addZValuesToPoints(points, elevationData.height, { zProperty });

  console.log({ pointsWithZ });

  const isolineSettings = {
    points: pointsWithZ,
    breaksDelta: 20,
    splined: isIsolinesSplined,
    isolinesOptions: { zProperty },
  };

  const isolines = isolinesType === 'turf' ? makeTurfIsolines(isolineSettings) : makeConrecIsolines(isolineSettings);

  return isolines;
};
