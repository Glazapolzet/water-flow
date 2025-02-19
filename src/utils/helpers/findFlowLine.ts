import clone from '@turf/clone';
import { featureCollection, lineString, point } from '@turf/helpers';
import { Feature, FeatureCollection, LineString, MultiLineString, Point } from 'geojson';
import { findFeatureWithMaxZValue } from './findFeatureWithMaxZValue';
import { findPerpendicularToLine } from './findPerpendicularToLine';

export const findFlowLine = (
  isolines: FeatureCollection<MultiLineString>,
  maxZValuePoint: Feature<Point>,
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  const clonedIsolines = clone(isolines);
  const stockLine = featureCollection<LineString>([]);
  let currentMaxZValuePoint = maxZValuePoint;

  while (clonedIsolines.features.length > 0) {
    const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(clonedIsolines, { zProperty });

    if (!closestIsoline) break;

    const perpendicular: [number, number][] = findPerpendicularToLine(
      closestIsoline.geometry.coordinates as [number, number][][],
      currentMaxZValuePoint.geometry.coordinates as [number, number],
    );

    /** Напиши здесь код, который проверяет, что найденный перпендикуляр не пересекает изолинию closestIsoline. Если да, то найди все возможные перпендикуляры с помощью findAllPerpendicularsToLine и выбери ближайший по расстоянию перпендикуляр, который не пересекает closestIsoline
     * const findAllPerpendicularsToLine: (line: [number, number][], point: [number, number]) => [number, number][][]
Находит все перпендикуляры от точки ко всей линии (если они существуют)
     *  **/

    stockLine.features.push(lineString(perpendicular));

    currentMaxZValuePoint = point(perpendicular[1]);

    clonedIsolines.features = clonedIsolines.features.filter((feature) => feature !== closestIsoline);
  }

  return stockLine;
};
