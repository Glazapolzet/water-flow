import bezierSpline from '@turf/bezier-spline';
import { lineString, multiLineString } from '@turf/helpers';
import { FeatureCollection, GeoJsonProperties, MultiLineString } from 'geojson';

export const splineIsolines = (
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
