import { Feature, FeatureCollection, GeoJsonProperties, MultiLineString, Point } from 'geojson';

export function generateFlowLines(
  contourLines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  startPoint: Feature<Point, GeoJsonProperties>,
  options: { zProperty: string },
): FeatureCollection<MultiLineString, GeoJsonProperties> {
  const { zProperty } = options;
  const flowLines: FeatureCollection<MultiLineString, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
  };

  if (!startPoint.properties || typeof startPoint.properties[`${zProperty}`] !== 'number') {
    return flowLines;
  }

  let currentPoint = startPoint;
  let currentZ = currentPoint.properties![zProperty];

  while (true) {
    let nearestSegment = null;
    let minDistance = Infinity;
    let nextZ = Infinity;
    let nearestPoint = null;
    let targetPoint = null;

    for (const contour of contourLines.features) {
      if (!contour.properties || typeof contour.properties[`${zProperty}`] !== 'number') {
        continue;
      }

      const contourZ = contour.properties[zProperty];
      if (contourZ >= currentZ) continue;

      for (const line of contour.geometry.coordinates) {
        for (let i = 0; i < line.length - 1; i++) {
          const segment = [line[i], line[i + 1]];
          const { distance, projection } = getPerpendicularProjection(currentPoint.geometry.coordinates, segment);

          if (distance < minDistance) {
            minDistance = distance;
            nearestSegment = { segment, projection, contour };
            nextZ = contourZ;
            targetPoint = projection;
          }
        }

        for (const point of line) {
          const distance = Math.hypot(
            point[0] - currentPoint.geometry.coordinates[0],
            point[1] - currentPoint.geometry.coordinates[1],
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = point;
            nextZ = contourZ;
            targetPoint = point;
          }
        }
      }
    }

    if (!targetPoint) break;

    // Если перпендикуляр пересекает другую изолинию, выбираем ближайшую точку
    if (
      nearestSegment &&
      doesIntersectAnyContour(currentPoint.geometry.coordinates, targetPoint, contourLines, nearestSegment.contour)
    ) {
      targetPoint = nearestPoint;
    }

    if (!targetPoint) break;

    flowLines.features.push({
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: [[currentPoint.geometry.coordinates, targetPoint]],
      },
      properties: {},
    });

    currentPoint = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: targetPoint },
      properties: { [zProperty]: nextZ },
    };
    currentZ = nextZ;
  }

  return flowLines;
}

function getPerpendicularProjection(point: number[], segment: number[][]) {
  const [A, B] = segment;
  const [px, py] = point;
  const [ax, ay] = A;
  const [bx, by] = B;

  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) return { distance: Infinity, projection: A };

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  const projection = [ax + t * dx, ay + t * dy];

  return { distance: Math.hypot(px - projection[0], py - projection[1]), projection };
}

function doesIntersectAnyContour(
  start: number[],
  end: number[],
  contourLines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  ignoredContour: Feature<MultiLineString, GeoJsonProperties> | null,
): boolean {
  for (const contour of contourLines.features) {
    if (contour === ignoredContour) continue;

    for (const line of contour.geometry.coordinates) {
      for (let i = 0; i < line.length - 1; i++) {
        const segment = [line[i], line[i + 1]];
        if (segmentsIntersect(start, end, segment[0], segment[1])) {
          return true;
        }
      }
    }
  }
  return false;
}

function segmentsIntersect(A: number[], B: number[], C: number[], D: number[]): boolean {
  function crossProduct(P: number[], Q: number[], R: number[]) {
    return (Q[0] - P[0]) * (R[1] - P[1]) - (Q[1] - P[1]) * (R[0] - P[0]);
  }

  const d1 = crossProduct(A, B, C);
  const d2 = crossProduct(A, B, D);
  const d3 = crossProduct(C, D, A);
  const d4 = crossProduct(C, D, B);

  if (d1 * d2 < 0 && d3 * d4 < 0) return true;

  return false;
}
