import { featureCollection, lineString, point } from '@turf/helpers';
import lineIntersect from '@turf/line-intersect';
import { Feature, FeatureCollection, GeoJsonProperties, LineString, MultiLineString, Point } from 'geojson';
import { sortIsolinesByZ } from '../../utils/helpers/sortIsolinesByZ';

export function generateFlowLinesOld(
  isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
  startPoint: Feature<Point, GeoJsonProperties>,
  options: { zProperty: string },
): FeatureCollection<LineString, GeoJsonProperties> {
  const { zProperty } = options;

  if (!startPoint.properties || typeof startPoint.properties[zProperty] !== 'number') {
    return featureCollection([]);
  }

  const processedIsolines: Set<Feature<MultiLineString, GeoJsonProperties>> = new Set();
  const isolinesInDescendingOrder = sortIsolinesByZ(isolines, { zProperty });

  function traceFlow(
    currentPoint: Feature<Point, GeoJsonProperties>,
    currentIsolineIndex: number,
    isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
    processedIsolines: Set<Feature<MultiLineString>>,
  ) {
    const localFlowLines: FeatureCollection<LineString, GeoJsonProperties> = featureCollection([]);
    if (!isolines.features[currentIsolineIndex]) {
      return localFlowLines;
    }
    const isoline = isolines.features[currentIsolineIndex];

    let minDistance = Infinity;
    let targetPoints: number[][] = [];

    if (!isoline.properties || typeof isoline.properties[zProperty] !== 'number') {
      return localFlowLines;
    }
    const nextZ = isoline.properties[zProperty];

    for (const line of isoline.geometry.coordinates) {
      for (const pt of line) {
        const distance = Math.hypot(
          pt[0] - currentPoint.geometry.coordinates[0],
          pt[1] - currentPoint.geometry.coordinates[1],
        );

        if (distance < minDistance) {
          minDistance = distance;
          targetPoints = [pt];
        } else if (distance === minDistance) {
          targetPoints.push(pt);
        }
      }
    }

    targetPoints = targetPoints.filter((target) => {
      const newLine = lineString([currentPoint.geometry.coordinates, target]);
      return !checkIfLineIntersectsProcessedIsolines([...processedIsolines], newLine);
    });

    if (targetPoints.length === 0) return localFlowLines;

    processedIsolines.add(isoline);

    for (const target of targetPoints) {
      const newLine = lineString([currentPoint.geometry.coordinates, target]);
      localFlowLines.features.push(newLine);

      const newFlowLines = traceFlow(
        point(target, { [zProperty]: nextZ }),
        currentIsolineIndex + 1,
        isolines,
        processedIsolines,
      );
      localFlowLines.features.push(...newFlowLines.features);
    }

    return localFlowLines;
  }

  const t = traceFlow(startPoint, 0, isolinesInDescendingOrder, processedIsolines);

  return t;
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

// function getPerpendicularProjection(point: number[], segment: number[][]) {
//   const [A, B] = segment;
//   const [px, py] = point;
//   const [ax, ay] = A;
//   const [bx, by] = B;

//   const dx = bx - ax;
//   const dy = by - ay;
//   const lengthSquared = dx * dx + dy * dy;

//   if (lengthSquared === 0) return { distance: Infinity, projection: A };

//   const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
//   const projection = [ax + t * dx, ay + t * dy];

//   return { distance: Math.hypot(px - projection[0], py - projection[1]), projection };
// }

// export function generateFlowLines(
//   isolines: FeatureCollection<MultiLineString, GeoJsonProperties>,
//   startPoint: Feature<Point, GeoJsonProperties>,
//   options: { zProperty: string },
// ): FeatureCollection<MultiLineString, GeoJsonProperties> {
//   const { zProperty } = options;
//   const flowLines: FeatureCollection<MultiLineString, GeoJsonProperties> = {
//     type: 'FeatureCollection',
//     features: [],
//   };
//   let currentPoint = startPoint;

//   // Проверка наличия свойства высоты у начальной точки
//   if (!currentPoint.properties || typeof currentPoint.properties[zProperty] !== 'number') {
//     return flowLines;
//   }

//   const processedIsolines: Feature<MultiLineString, GeoJsonProperties>[] = [];

//   // Сортировка изолиний по высоте в порядке убывания
//   const isolinesInDescendingOrder = sortIsolinesByZ(isolines, { zProperty });

//   for (const isoline of isolinesInDescendingOrder.features) {
//     let minDistance = Infinity;
//     let targetPoint = null;

//     // Проверка наличия свойства высоты у текущей изолинии
//     if (!isoline.properties || typeof isoline.properties[zProperty] !== 'number') {
//       continue;
//     }

//     const nextZ = isoline.properties[zProperty];

//     // Перебор всех сегментов текущей изолинии
//     for (const line of isoline.geometry.coordinates) {
//       for (let i = 0; i < line.length - 1; i++) {
//         const segment = [line[i], line[i + 1]];
//         const { distance, projection } = getPerpendicularProjection(currentPoint.geometry.coordinates, segment);

//         if (distance < minDistance) {
//           // Проверяем, пересекает ли перпендикуляр уже обработанные изолинии
//           const perpendicularLine = lineString([currentPoint.geometry.coordinates, projection]);
//           const intersects = checkIfLineIntersectsProcessedIsolines(processedIsolines, perpendicularLine);

//           if (!intersects) {
//             minDistance = distance;
//             targetPoint = projection;
//           }
//         }
//       }

//       // Поиск ближайшей точки на изолинии, если не найден корректный перпендикуляр
//       for (const point of line) {
//         const distance = Math.hypot(
//           point[0] - currentPoint.geometry.coordinates[0],
//           point[1] - currentPoint.geometry.coordinates[1],
//         );

//         if (distance < minDistance) {
//           const line = lineString([currentPoint.geometry.coordinates, point]);
//           const intersects = checkIfLineIntersectsProcessedIsolines(processedIsolines, line);

//           if (!intersects) {
//             minDistance = distance;
//             targetPoint = point;
//           }
//         }
//       }
//     }

//     // Если не удалось найти точку для соединения, прерываем цикл
//     if (!targetPoint) break;

//     // Добавляем построенную линию в результат
//     flowLines.features.push(multiLineString([[currentPoint.geometry.coordinates, targetPoint]]));

//     // Обновляем текущую точку и её высоту
//     currentPoint = point(targetPoint, { [zProperty]: nextZ });

//     // Добавляем обработанную изолинию в список
//     processedIsolines.push(isoline);
//   }

//   return flowLines;
// }
