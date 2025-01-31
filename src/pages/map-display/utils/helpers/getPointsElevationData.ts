import { vallhalaApi } from '@/api/valhalla';
import { makeValhallaMappings, transformXYToLonLat } from '@/utils/helpers';
import { coordAll } from '@turf/meta';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export const getPointsElevationData = async (points: FeatureCollection<Point, GeoJsonProperties>) => {
  const coordinates = transformXYToLonLat(coordAll(points));
  const mappedData = makeValhallaMappings(coordinates);

  return await vallhalaApi.getElevation(mappedData);
};
