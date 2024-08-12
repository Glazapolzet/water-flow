import { FeatureCollection, Point } from 'geojson';
import { ConrecHelper } from './ConrecHelper';

export const makeConrecIsolines = (pointGrid: FeatureCollection<Point>, options?: { zProperty?: string }) => {
  const c = new ConrecHelper(pointGrid, options ?? {});

  const features = c.drawFeatures();

  return features;
};
