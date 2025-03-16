import { lineString, multiLineString, point } from '@turf/helpers';
import lineIntersect from '@turf/line-intersect';
import { Feature, FeatureCollection, GeoJsonProperties, MultiLineString, Point } from 'geojson';

export function generateFlowLinesTest(
  isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  startPoint: Feature<Point, GeoJsonProperties>,
  options: { zProperty: string },
): FeatureCollection<MultiLineString, GeoJsonProperties> {
  const { zProperty } = options;
  const flowLines: FeatureCollection<MultiLineString, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [],
  };
  let currentPoint = startPoint;

  if (!currentPoint.properties || typeof currentPoint.properties[`${zProperty}`] !== 'number') {
    return flowLines;
  }

  let currentZ = currentPoint.properties[zProperty];
  const processedIsolines: Feature<MultiLineString, GeoJsonProperties>[] = [];

  while (true) {
    let nearestSegment = null;
    let minDistance = Infinity;
    let nextZ = Infinity;
    let targetPoint = null;

    for (const isoline of isolines.features) {
      //TODO: make checkZProperty function
      if (!isoline.properties || typeof isoline.properties[`${zProperty}`] !== 'number') {
        continue;
      }

      const isolineZ = isoline.properties[zProperty];
      if (isolineZ > currentZ || processedIsolines.includes(isoline)) continue;

      for (const line of isoline.geometry.coordinates) {
        for (let i = 0; i < line.length - 1; i++) {
          const segment = [line[i], line[i + 1]];
          const { distance, projection } = getPerpendicularProjection(currentPoint.geometry.coordinates, segment);

          if (distance < minDistance) {
            // Проверяем, пересекает ли перпендикуляр уже обработанные изолинии
            const perpendicularLine = lineString([currentPoint.geometry.coordinates, projection]);
            const intersects = processedIsolines.some((isoline) => {
              return lineIntersect(isoline, perpendicularLine).features.length > 0;
            });

            if (!intersects) {
              minDistance = distance;
              nearestSegment = { segment, projection, isoline };
              nextZ = isolineZ;
              targetPoint = projection;
            }
          }
        }

        for (const point of line) {
          const distance = Math.hypot(
            point[0] - currentPoint.geometry.coordinates[0],
            point[1] - currentPoint.geometry.coordinates[1],
          );
          if (distance < minDistance) {
            minDistance = distance;
            nextZ = isolineZ;
            targetPoint = point;
          }
        }
      }
    }

    if (!targetPoint) break;

    flowLines.features.push(multiLineString([[currentPoint.geometry.coordinates, targetPoint]]));

    currentPoint = point(targetPoint, { [zProperty]: nextZ });
    currentZ = nextZ;

    if (nearestSegment) {
      processedIsolines.push(nearestSegment.isoline);
    }
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
