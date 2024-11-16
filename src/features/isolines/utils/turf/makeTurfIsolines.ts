import isolines from '@turf/isolines';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { makeBreaks, makeSplinedIsolines } from '../common';

export const makeTurfIsolines = (settings: {
  points: FeatureCollection<Point, GeoJsonProperties>;
  breaks?: number[];
  options?: {
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
  const { points, breaks: defaultBreaks, options, splined = false, splineOptions } = settings;
  console.log({ POINTS: points });

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks();
  const iso = isolines(points, breaks, options);

  return splined ? makeSplinedIsolines(iso, splineOptions) : iso;
};
