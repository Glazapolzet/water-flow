import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { toLonLat } from 'ol/proj';

import { vallhalaApi } from '@/api/valhalla';
import { IsolinesTypeLiteral, makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { makeValhallaMappings } from '@/utils/helpers/makeValhallaMappings';

const makeLonLatList = (points: FeatureCollection<Point, GeoJsonProperties>, options: { zProperty: string }) => {
  const lonLatList = [];
  const { zProperty } = options;

  for (let i = 0; i < points.features.length; i++) {
    if (points.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    const [lon, lat] = toLonLat(points.features[i].geometry.coordinates);

    lonLatList.push({ lon, lat });
  }

  return lonLatList;
};

const getPointsElevationData = async (
  points: FeatureCollection<Point, GeoJsonProperties>,
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  const lonLatList = makeLonLatList(points, { zProperty });
  const mappedData = makeValhallaMappings(lonLatList);

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
    if (pointsWithZ.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    pointsWithZ.features[i].properties![`${zProperty}`] = ZValues[i];
  }

  return pointsWithZ;
};

export const makeIsolines = async (
  points: FeatureCollection<Point>,
  isolinesType: IsolinesTypeLiteral,
  options?: {
    zProperty?: string;
    isIsolinesSplined?: boolean;
  },
) => {
  //TODO: fixme!
  const { zProperty = 'zValue', isIsolinesSplined = false } = options ?? {};

  const elevationData = await getPointsElevationData(points, { zProperty });
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
