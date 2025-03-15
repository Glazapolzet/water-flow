import { featureCollection, lineString, point } from '@turf/helpers';
import { Feature, FeatureCollection, MultiLineString, Point } from 'geojson';
import { findAllPerpendicularsToLine } from './findAllPerpendicularsToLine';
import { findFeatureWithMaxZValue } from './findFeatureWithMaxZValue';
import { findFlowLine } from './findFlowLine';

export const findFlowLines = (
  isolines: FeatureCollection<MultiLineString>,
  maxZValuePoint: Feature<Point>,
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  // Находим ближайшую изолинию с максимальным Z-значением
  const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(isolines, { zProperty });
  if (!closestIsoline) {
    return []; // Если изолиния не найдена, возвращаем пустой массив
  }

  // Находим перпендикуляры к ближайшей изолинии
  const perpendiculars: [number, number][][] = findAllPerpendicularsToLine(
    closestIsoline.geometry.coordinates as [number, number][][],
    maxZValuePoint.geometry.coordinates as [number, number],
  );

  // Удаляем ближайшую изолинию из списка
  const isolinesWithoutClosest = isolines.features.filter((feature) => feature !== closestIsoline);

  // Создаем линии потока на основе найденных перпендикуляров
  return perpendiculars.map(([start, end]) => {
    const localMaxZValuePoint = point(end);
    const stockLineStart = lineString([start, end]);

    // Находим линию потока, используя оставшиеся изолинии
    const stockLine = findFlowLine(featureCollection(isolinesWithoutClosest), localMaxZValuePoint, [closestIsoline], {
      zProperty,
    });

    // Добавляем начальную линию потока к найденной линии
    stockLine.features.unshift(stockLineStart);
    return stockLine;
  });
};
