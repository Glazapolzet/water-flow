import { featureEach } from '@turf/meta';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export const findFeatureWithMaxZValue = <G extends Geometry>(
  features: FeatureCollection<G>,
  options: { zProperty: string },
): Feature<G, GeoJsonProperties> | null => {
  const { zProperty } = options;
  let maxZValueFeature: Feature<G> | null = null;
  let maxZValue: number | null = null;

  featureEach(features, (currentFeature) => {
    if (!currentFeature.properties || typeof currentFeature.properties[`${zProperty}`] !== 'number') {
      return;
    }

    if (maxZValue === null || currentFeature.properties[`${zProperty}`] > maxZValue) {
      maxZValue = currentFeature.properties[`${zProperty}`];
      maxZValueFeature = currentFeature;
    }
  });

  return maxZValueFeature;
};
