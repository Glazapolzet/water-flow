import bezierSpline from '@turf/bezier-spline';
import { lineString, multiLineString } from '@turf/helpers';
import isolines from '@turf/isolines';

type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

type Feature = {
  type: 'Feature';
  properties: {
    z: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number][][];
  };
};

type IsolineTupledParameters = Parameters<typeof isolines>;

type PointGrid = IsolineTupledParameters[0];
type Breaks = IsolineTupledParameters[1];
type Options = IsolineTupledParameters[2];

type IsolineObjParameters = {
  pointGrid: PointGrid;
  breaks: Breaks;
  options: Options;
};

type SplineOptions = Parameters<typeof bezierSpline>[1];

type FunctionType = (isolineProps: IsolineObjParameters, splineOptions?: SplineOptions) => ReturnType<typeof isolines>;

export const makeTurfSplinedIsolines: FunctionType = ({ pointGrid, breaks, options = {} }, splineOptions) => {
  const iso: FeatureCollection = isolines(pointGrid, breaks, options);

  for (let i = 1; i < iso.features.length; i++) {
    const multiline = iso.features[i].geometry.coordinates;
    const newMultiline = [];

    for (let m = 0; m < multiline.length; m++) {
      const lines = multiline[m];
      const splinedLineStr = bezierSpline(lineString(lines), splineOptions);

      newMultiline.push(splinedLineStr.geometry.coordinates);
    }

    iso.features[i] = multiLineString(newMultiline);
  }

  return iso;
};
