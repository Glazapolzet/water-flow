import clone from '@turf/clone';
import { featureCollection, lineString, point } from '@turf/helpers';
import lineIntersect from '@turf/line-intersect';
import { Feature, FeatureCollection, LineString, MultiLineString, Point } from 'geojson';
import { findAllPathsToLine } from './findAllPathsToLine';
import { findFeatureWithMaxZValue } from './findFeatureWithMaxZValue';

export const findFlowLine = (
  isolines: FeatureCollection<MultiLineString>,
  maxZValuePoint: Feature<Point>,
  processedIsolines: Feature<MultiLineString>[],
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  const clonedIsolines = clone(isolines);
  const stockLine = featureCollection<LineString>([]);
  let currentMaxZValuePoint = maxZValuePoint;

  while (clonedIsolines.features.length > 0) {
    // Находим ближайшую изолинию с максимальным Z-значением
    const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(clonedIsolines, { zProperty });
    let perpendicular: [number, number][] = [];
    if (!closestIsoline) break; // Если изолиния не найдена, выходим из цикла

    // Находим все перпендикуляры к ближайшей изолинии
    const allPerpendiculars = findAllPathsToLine(
      closestIsoline.geometry.coordinates as [number, number][][],
      currentMaxZValuePoint.geometry.coordinates as [number, number],
    );

    // Фильтруем перпендикуляры, чтобы исключить пересечения с обработанными изолиниями
    const validPerpendiculars = allPerpendiculars.filter((perpendicular) => {
      const isIntersectingProcessedIsolines = processedIsolines.some((isoline) => {
        const intersections = lineIntersect(isoline, lineString(perpendicular), { ignoreSelfIntersections: true });
        const hasOnlyPerpendicularStartIntersection =
          intersections.features.some(
            (point) =>
              point.geometry.coordinates[0] === perpendicular[0][0] &&
              point.geometry.coordinates[1] === perpendicular[0][1],
          ) && intersections.features.length === 1;

        const hasNoIntersections = intersections.features.length === 0;
        return !hasOnlyPerpendicularStartIntersection && !hasNoIntersections;
      });

      const closestIsolineIntersections = lineIntersect(closestIsoline, lineString(perpendicular), {
        ignoreSelfIntersections: true,
      });

      const hasOnlyPerpendicularEndIntersection =
        closestIsolineIntersections.features.some(
          (point) =>
            point.geometry.coordinates[0] === perpendicular[1][0] &&
            point.geometry.coordinates[1] === perpendicular[1][1],
        ) && closestIsolineIntersections.features.length === 1;

      const hasNoIntersections = closestIsolineIntersections.features.length === 0;
      const isIntersectingClosestIsoline = !(hasOnlyPerpendicularEndIntersection || hasNoIntersections);

      return !isIntersectingProcessedIsolines && !isIntersectingClosestIsoline;
    });

    // Выбираем ближайший по расстоянию корректный перпендикуляр
    if (validPerpendiculars.length > 0) {
      perpendicular = validPerpendiculars.reduce((nearest, current) => {
        const distNearest = Math.hypot(nearest[0][0] - nearest[1][0], nearest[0][1] - nearest[1][1]);
        const distCurrent = Math.hypot(current[0][0] - current[1][0], current[0][1] - current[1][1]);
        return distCurrent < distNearest ? current : nearest;
      });
    }

    if (perpendicular.length === 0) break; // Если нет корректных перпендикуляров, выходим из цикла

    stockLine.features.push(lineString(perpendicular));
    currentMaxZValuePoint = point(perpendicular[1]); // Обновляем текущую точку максимального Z-значения
    processedIsolines.push(closestIsoline); // Добавляем обработанную изолинию в список
    clonedIsolines.features = clonedIsolines.features.filter((feature) => feature !== closestIsoline); // Удаляем обработанную изолинию
  }

  return stockLine; // Возвращаем найденную линию потока
};
