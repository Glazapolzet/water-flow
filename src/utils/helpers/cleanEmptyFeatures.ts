import { Feature, GeoJsonProperties, Geometry, GeometryCollection } from 'geojson';

//TODO: add better types
export const cleanEmptyFeatures = <T extends Exclude<Geometry, GeometryCollection<Geometry>>>(
  features: Feature<T, GeoJsonProperties>[],
) => {
  return features.filter((feature) => feature.geometry.coordinates.length > 0);
};
