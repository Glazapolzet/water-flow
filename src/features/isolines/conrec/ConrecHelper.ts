import { MatrixHelper } from '@/utils/helpers';
import { featureCollection, multiLineString } from '@turf/helpers';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Conrec } from 'ml-conrec';

export class ConrecHelper extends Conrec {
  private matrixHelper: MatrixHelper;
  private options: {
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
        return this.matrixHelper.restoreCoordinates(x, y);
      });

      const feature = multiLineString([lines], { [`${zProperty}`]: contour.contours[i].level, ...commonProperties });

      features.push(feature);
    }

    return featureCollection(features);
  }
}
