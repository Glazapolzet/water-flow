import bezierSpline from '@turf/bezier-spline';
import { lineString, multiLineString } from '@turf/helpers';
import { FeatureCollection, GeoJsonProperties, MultiLineString } from 'geojson';

export const makeSplinedIsolines = (
  isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  options?: {
    resolution?: number;
    sharpness?: number;
  },
) => {
  for (let i = 1; i < isolines.features.length; i++) {
    const multiline = isolines.features[i].geometry.coordinates;
    const newMultiline = [];

    for (let m = 0; m < multiline.length; m++) {
      const lines = multiline[m];
      const splinedLineStr = bezierSpline(lineString(lines), options);

      newMultiline.push(splinedLineStr.geometry.coordinates);
    }

    isolines.features[i] = multiLineString(newMultiline, isolines.features[i].properties);
  }

  return isolines;
};

export const makeBreaks = (breaksDelta: number) => {
  const MAX_EARTH_HEIGHT = 9999;
  const breaks: number[] = [];

  for (let br = breaksDelta; br < MAX_EARTH_HEIGHT; br += breaksDelta) {
    breaks.push(br);
  }

  return breaks;
};

// export const makeBreaks = (
//   pointGrid: FeatureCollection<Point, GeoJsonProperties>,
//   options?: { zProperty?: string },
// ) => {
//   const breaks: number[] = [];
//   const { zProperty } = options ?? {};

//   for (let i = 0; i < pointGrid.features.length; i++) {
//     breaks.push(
//       zProperty ? pointGrid.features[i].properties?.[`${zProperty}`] : pointGrid.features[i].geometry.coordinates?.[2],
//     );
//   }

//   return breaks.sort((a, b) => a - b);
// };
