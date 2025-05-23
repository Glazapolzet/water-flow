import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

import isolines from '@turf/isolines';
import { makeBreaks, splineIsolines } from '../utils';

export const makeIsolines = (settings: {
  points: FeatureCollection<Point, GeoJsonProperties>;
  breaksDelta: number;
  breaks?: number[];
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
  const { points, breaks: defaultBreaks, breaksDelta, isolinesOptions, splined = false, splineOptions } = settings;

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks(breaksDelta);
  const iso = isolines(points, breaks, isolinesOptions);

  return splined ? splineIsolines(iso, splineOptions) : iso;
};
