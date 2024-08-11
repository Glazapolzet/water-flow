import { featureCollection, multiLineString } from '@turf/helpers';
import { BBox, FeatureCollection, Point } from 'geojson';
import { Conrec, DrawContourResult } from 'ml-conrec';

const toConrecMatrix = (pointGrid: FeatureCollection<Point>, options?: { zProperty?: string }) => {
  const features = pointGrid.features;

  const getZProperty = (index: number) => {
    return options?.zProperty
      ? features[index]?.properties?.[options.zProperty]
      : features[index].geometry.coordinates[2];
  };

  const matrix: number[][] = [[]];

  matrix[0] = [getZProperty(0)];

  let xIndex = 0;
  let yIndex = 0;

  for (let i = 1; i < features.length; i++) {
    const [currX, currY] = features[i].geometry.coordinates;
    const [prevX, prevY] = features[i - 1].geometry.coordinates;

    const dx = currX - prevX;
    const dy = currY - prevY;

    if (dx === 0) {
      yIndex += 1;

      if (!matrix[yIndex]) {
        matrix[yIndex] = [getZProperty(i)];
        continue;
      }
    }

    if (dy <= 0) {
      xIndex += 1;
      yIndex = 0;
    }

    matrix[yIndex][xIndex] = getZProperty(i);
  }

  return matrix;
};

const restoreCoordinatesToBbox = (x: number, y: number, dx: number, dy: number, bbox: BBox): [x: number, y: number] => {
  const [firstX, firstY] = bbox;

  return [firstX + x * dx, firstY + y * dy];
};

const contourToFeatures = (contour: DrawContourResult<'shape'>, sourceMatrix: number[][]) => {
  const dx = sourceMatrix[1];
  const features = [];

  for (let i = 0; i < contour.contours.length; i++) {
    const linesWithXYObj = contour.contours[i].lines;
    const lines = linesWithXYObj.map(({ x, y }) => {
      restoreCoordinatesToBbox(x, y);
    });

    const feature = multiLineString([lines], { zValue: contour.contours[i].level });

    features.push(feature);
  }

  return featureCollection(features);
};

export const makeConrecIsolines = (pointGrid: FeatureCollection<Point>, options?: { zProperty?: string }) => {
  const matrix = toConrecMatrix(pointGrid, options);

  const conrec = new Conrec(matrix);
  const contour = conrec.drawContour({ contourDrawer: 'shape' });

  const features = contourToFeatures(contour, matrix);

  // console.log({ conrecComputed: contour });

  return features;
};
