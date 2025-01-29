import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

import { makeBreaks, makeSplinedIsolines } from '../helpers';
import { ConrecHelper } from './ConrecHelper';

export const makeConrecIsolines = (settings: {
  points: FeatureCollection<Point, GeoJsonProperties>;
  breaks?: number[];
  breaksDelta?: number;
  isolinesOptions?: { zProperty?: string; commonProperties?: GeoJsonProperties };
  splined?: boolean;
  splineOptions?: {
    resolution?: number;
    sharpness?: number;
  };
  timeout?: number;
}) => {
  const {
    points,
    breaks: defaultBreaks,
    breaksDelta = 90,
    isolinesOptions,
    splined = false,
    splineOptions,
    timeout,
  } = settings;
  const { zProperty, commonProperties } = isolinesOptions ?? {};

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks(breaksDelta);

  const contourSettings = {
    levels: breaks,
    nbLevels: breaks?.length,
    timeout,
  };

  const c = new ConrecHelper(points, { zProperty });
  const iso = c.drawFeatures(contourSettings, { commonProperties });

  return splined ? makeSplinedIsolines(iso, splineOptions) : iso;
};
