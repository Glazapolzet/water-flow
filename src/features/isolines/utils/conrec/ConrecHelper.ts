import { featureCollection, multiLineString } from '@turf/helpers';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Conrec } from 'ml-conrec';
import { MatrixHelper } from './MatrixHelper';

export class ConrecHelper extends Conrec {
  matrixHelper: MatrixHelper;
  options: {
    zProperty?: string;
  };

  constructor(
    pointGrid: FeatureCollection<Point, GeoJsonProperties>,
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
