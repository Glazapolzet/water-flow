import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { makeBreaks, makeSplinedIsolines } from '../common';
import { ConrecHelper } from './ConrecHelper';

export const makeConrecIsolines = (settings: {
  points: FeatureCollection<Point, GeoJsonProperties>;
  breaks?: number[];
  options?: { zProperty?: string; commonProperties?: GeoJsonProperties };
  splined?: boolean;
  splineOptions?: {
    resolution?: number;
    sharpness?: number;
  };
  timeout?: number;
}) => {
  const { points, breaks: defaultBreaks, options, splined = false, splineOptions, timeout } = settings;
  const { zProperty, commonProperties } = options ?? {};

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks();

  const contourSettings = {
    levels: breaks,
    nbLevels: breaks?.length,
    timeout,
  };

  const c = new ConrecHelper(points, { zProperty });
  const iso = c.drawFeatures(contourSettings, { commonProperties });

  return splined ? makeSplinedIsolines(iso, splineOptions) : iso;
};
