import { featureCollection, multiLineString } from '@turf/helpers';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Conrec } from 'ml-conrec';

export class ConrecHelper extends Conrec {
  matrixHelper: MatrixHelper;
  options: {
    zProperty?: string;
  };

  constructor(
    pointGrid: FeatureCollection<Point>,
    options?: {
      zProperty?: string;
    },
  ) {
    const { zProperty } = options ?? {};
    const matrixHelper = new MatrixHelper(pointGrid, { zProperty });

    super(matrixHelper.getZmatrix());
    this.matrixHelper = matrixHelper;

    this.options = options ? options : {};
  }

  drawFeatures(
    contourSettings?: {
      levels?: number[];
      nbLevels?: number;
      timeout?: number;
    },
    options?: {
      commonProperties?: GeoJsonProperties;
    },
  ) {
    const { commonProperties } = options ?? {};
    const { zProperty = 'elevation' } = this.options;

    const contour = super.drawContour({ contourDrawer: 'shape', ...contourSettings });
    console.log(contour);

    const features = [];

    for (let i = 0; i < contour.contours.length; i++) {
      const linesWithXYObj = contour.contours[i].lines;
      const lines = linesWithXYObj.map(({ x, y }) => {
        return this._restoreCoordinates(x, y);
      });

      const feature = multiLineString([lines], { [`${zProperty}`]: contour.contours[i].level, ...commonProperties });

      features.push(feature);
    }

    return featureCollection(features);
  }

  private _restoreCoordinates(x: number, y: number) {
    const [dx, dy] = this.matrixHelper.getDeltas();
    const [firstX, firstY] = this.matrixHelper.getXYmatrix()?.[0]?.[0];

    return [firstX + x * dx, firstY + y * dy];
  }
}

class MatrixHelper {
  private XYmatrix: number[][][];
  private Zmatrix: number[][];
  private dx: number;
  private dy: number;

  constructor(pointGrid: FeatureCollection<Point>, options?: { zProperty?: string }) {
    const { XYmatrix, Zmatrix } = this.initMatrix(pointGrid, options);
    this.XYmatrix = XYmatrix;
    this.Zmatrix = Zmatrix;

    const { dx, dy } = this.findDeltas();
    this.dx = dx;
    this.dy = dy;
  }

  getXYmatrix() {
    return this.XYmatrix;
  }

  getZmatrix() {
    return this.Zmatrix;
  }

  getDeltas() {
    return [this.dx, this.dy];
  }

  private findDeltas() {
    const [firstX, firstY] = this.XYmatrix?.[0]?.[0];
    const nextX = this.XYmatrix?.[0]?.[1]?.[0];
    const nextY = this.XYmatrix?.[1]?.[0]?.[1];

    const dx = nextX ? nextX - firstX : 0;
    const dy = nextY ? nextY - firstY : 0;

    return { dx, dy };
  }

  private initMatrix(pointGrid: FeatureCollection<Point>, options?: { zProperty?: string }) {
    const features = pointGrid.features;

    const getXY = (index: number): [number, number] => {
      const [x, y] = features[index].geometry.coordinates;

      return [x, y];
    };

    const getZProperty = (index: number): number => {
      return options?.zProperty
        ? features[index]?.properties?.[options.zProperty]
        : features[index].geometry.coordinates[2];
    };

    const XYmatrix: number[][][] = [[[]]];
    const Zmatrix: number[][] = [[]];

    XYmatrix[0] = [getXY(0)];
    Zmatrix[0] = [getZProperty(0)];

    let xIndex = 0;
    let yIndex = 0;

    for (let i = 1; i < features.length; i++) {
      const [currX, currY] = getXY(i);
      const [prevX, prevY] = getXY(i - 1);

      const dx = currX - prevX;
      const dy = currY - prevY;

      if (dx === 0) {
        yIndex += 1;

        if (!XYmatrix[yIndex]) {
          XYmatrix[yIndex] = [getXY(i)];
          Zmatrix[yIndex] = [getZProperty(i)];

          continue;
        }
      }

      if (dy <= 0) {
        xIndex += 1;
        yIndex = 0;
      }

      XYmatrix[yIndex][xIndex] = getXY(i);
      Zmatrix[yIndex][xIndex] = getZProperty(i);
    }

    return { XYmatrix, Zmatrix };
  }
}
