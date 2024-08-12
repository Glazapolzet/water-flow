import bezierSpline from '@turf/bezier-spline';
import { lineString, multiLineString } from '@turf/helpers';
import isolines from '@turf/isolines';

type IsolineTupledParameters = Parameters<typeof isolines>;

type PointGrid = IsolineTupledParameters[0];
type Breaks = IsolineTupledParameters[1];
type Options = IsolineTupledParameters[2];

type IsolineSettings = {
  pointGrid: PointGrid;
  breaks: Breaks;
  options?: Options;
};

type SplineOptions = Omit<NonNullable<Parameters<typeof bezierSpline>[1]>, 'properties'>;

export const makeTurfSplinedIsolines = (isolineSettings: IsolineSettings, splineOptions?: SplineOptions) => {
  const { pointGrid, breaks, options } = isolineSettings;

  const iso = isolines(pointGrid, breaks, options);

  for (let i = 1; i < iso.features.length; i++) {
    const multiline = iso.features[i].geometry.coordinates;
    const newMultiline = [];

    for (let m = 0; m < multiline.length; m++) {
      const lines = multiline[m];
      const splinedLineStr = bezierSpline(lineString(lines), splineOptions);

      newMultiline.push(splinedLineStr.geometry.coordinates);
    }

    iso.features[i] = multiLineString(newMultiline, iso.features[i].properties);
  }

  return iso;
};
