import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

import isolines from '@turf/isolines';

import { makeBreaks, makeSplinedIsolines } from '../helpers';

export const makeTurfIsolines = (settings: {
  points: FeatureCollection<Point, GeoJsonProperties>;
  breaks?: number[];
  breaksDelta?: number;
  isolinesOptions?: {
    zProperty?: string;
    commonProperties?: GeoJsonProperties;
    breaksProperties?: GeoJsonProperties[];
  };
  splined?: boolean;
  splineOptions?: {
    resolution?: number;
    sharpness?: number;
  };
}) => {
  const { points, breaks: defaultBreaks, breaksDelta = 90, isolinesOptions, splined = false, splineOptions } = settings;

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks(breaksDelta);
  const iso = isolines(points, breaks, isolinesOptions);

  return splined ? makeSplinedIsolines(iso, splineOptions) : iso;
};
