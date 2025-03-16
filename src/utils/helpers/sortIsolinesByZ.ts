import { FeatureCollection, GeoJsonProperties, MultiLineString } from 'geojson';

export const sortIsolinesByZ = (
  isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  options: { zProperty: string },
): FeatureCollection<MultiLineString, GeoJsonProperties> => {
  const { zProperty } = options;

  const sortedFeatures = [...isolines.features].sort((a, b) => {
    const zA = a.properties?.[zProperty] ?? -Infinity;
    const zB = b.properties?.[zProperty] ?? -Infinity;
    return zB - zA;
  });

  return {
    ...isolines,
    features: sortedFeatures,
  };
};
