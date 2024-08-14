import isolines from '@turf/isolines';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { makeBreaks, makeSplinedIsolines } from '../helpers';

export const makeTurfIsolines = (settings: {
  pointGrid: FeatureCollection<Point, GeoJsonProperties>;
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
  const { pointGrid, breaks: defaultBreaks, options, splined = false, splineOptions } = settings;

  // console.log(pointGrid);

  const breaks = defaultBreaks ? defaultBreaks : makeBreaks(pointGrid, { zProperty: options?.zProperty });
  const iso = isolines(pointGrid, breaks, options);

  // console.log({ breaks: makeBreaks(pointGrid, { zProperty: options?.zProperty }) });

  return splined ? makeSplinedIsolines(iso, splineOptions) : iso;
};
