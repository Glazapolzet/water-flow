import { featureEach } from '@turf/meta';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const findFeatureWithMinZValue = <G extends Geometry>(
  features: FeatureCollection<G>,
  options: { zProperty: string },
): Feature<G, GeoJsonProperties> | null => {
  const { zProperty } = options;
  let minZValueFeature: Feature<G, GeoJsonProperties> | null = null;
  let minZValue: number | null = null;

  featureEach(features, (currentFeature) => {
    if (!currentFeature.properties || typeof currentFeature.properties[`${zProperty}`] !== 'number') {
      return;
    }

    if (minZValue === null || currentFeature.properties[`${zProperty}`] < minZValue) {
      minZValue = currentFeature.properties[`${zProperty}`];
      minZValueFeature = currentFeature;
    }
  });

  return minZValueFeature;
};
