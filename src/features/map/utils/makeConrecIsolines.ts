import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { ConrecHelper, ContourSettings } from './ConrecHelper';

export const makeConrecIsolines = (
  pointGrid: FeatureCollection<Point>,
  contourSettings?: ContourSettings,
  options?: { zProperty?: string; commonProperties?: GeoJsonProperties },
) => {
  const { zProperty, commonProperties } = options ?? {};

  const c = new ConrecHelper(pointGrid, { zProperty });

  return c.drawFeatures(contourSettings, { commonProperties });
};
