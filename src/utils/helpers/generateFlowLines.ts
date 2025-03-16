import { lineString, multiLineString, point } from '@turf/helpers';
import lineIntersect from '@turf/line-intersect';
import { Feature, FeatureCollection, GeoJsonProperties, LineString, MultiLineString, Point } from 'geojson';
import { sortIsolinesByZ } from './sortIsolinesByZ';

export function generateFlowLines(
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

  // let currentZ = currentPoint.properties[zProperty];
  const processedIsolines: Feature<MultiLineString, GeoJsonProperties>[] = [];

  const isolinesInDescendingOrder = sortIsolinesByZ(isolines, { zProperty });

  for (const isoline of isolinesInDescendingOrder.features) {
    let minDistance = Infinity;
    let nextZ = Infinity;
    let targetPoint = null;

    //TODO: make checkZProperty function
    if (!isoline.properties || typeof isoline.properties[`${zProperty}`] !== 'number') {
      continue;
    }

    const isolineZ = isoline.properties[zProperty];

    for (const line of isoline.geometry.coordinates) {
      for (let i = 0; i < line.length - 1; i++) {
        const segment = [line[i], line[i + 1]];
        const { distance, projection } = getPerpendicularProjection(currentPoint.geometry.coordinates, segment);

        if (distance < minDistance) {
          // Проверяем, пересекает ли перпендикуляр уже обработанные изолинии
          const perpendicularLine = lineString([currentPoint.geometry.coordinates, projection]);
          const intersects = checkIfLineIntersectsProcessedIsolines(processedIsolines, perpendicularLine);

          if (!intersects) {
            minDistance = distance;
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

    if (!targetPoint) break;

    flowLines.features.push(multiLineString([[currentPoint.geometry.coordinates, targetPoint]]));

    currentPoint = point(targetPoint, { [zProperty]: nextZ });
    // currentZ = nextZ;

    processedIsolines.push(isoline);
  }

  return flowLines;
}

function checkIfLineIntersectsProcessedIsolines(
  processedIsolines: Feature<MultiLineString>[],
  line: Feature<LineString, GeoJsonProperties>,
) {
  return processedIsolines.some((isoline) => {
    const intersections = lineIntersect(isoline, line, { ignoreSelfIntersections: true });

    const hasOnlyLineStartIntersection =
      intersections.features.some((intersectionPoint) => {
        const [intersectionPointX, intersectionPointY] = intersectionPoint.geometry.coordinates;
        const [lineStartX, lineStartY] = line.geometry.coordinates[0];

        return intersectionPointX === lineStartX && intersectionPointY === lineStartY;
      }) && intersections.features.length === 1;

    const hasNoIntersections = intersections.features.length === 0;
    return !hasOnlyLineStartIntersection && !hasNoIntersections;
  });
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
