import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';

export class MatrixHelper {
  private XYmatrix: number[][][];
  private Zmatrix: number[][];
  private dx: number;
  private dy: number;

  constructor(pointGrid: FeatureCollection<Point, GeoJsonProperties>, options?: { zProperty?: string }) {
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

  getDeltas(): [dx: number, dy: number] {
    return [this.dx, this.dy];
  }

  restoreCoordinates(x: number, y: number) {
    const [dx, dy] = this.getDeltas();
    const [firstX, firstY] = this.getXYmatrix()?.[0]?.[0];

    return [firstX + x * dx, firstY + y * dy];
  }

  private findDeltas() {
    const [firstX, firstY] = this.XYmatrix?.[0]?.[0];
    const nextX = this.XYmatrix?.[0]?.[1]?.[0];
    const nextY = this.XYmatrix?.[1]?.[0]?.[1];

    const dx = nextX ? nextX - firstX : 0;
    const dy = nextY ? nextY - firstY : 0;

    return { dx, dy };
  }

  private initMatrix(pointGrid: FeatureCollection<Point, GeoJsonProperties>, options?: { zProperty?: string }) {
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
