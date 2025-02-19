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
  const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(isolines, { zProperty });

  if (!closestIsoline) return [];

  const perpendiculars = findAllPerpendicularsToLine(
    closestIsoline.geometry.coordinates[0] as [number, number][],
    maxZValuePoint.geometry.coordinates as [number, number],
  );

  const isolinesWithoutClosest = isolines.features.filter((feature) => feature !== closestIsoline);

  return perpendiculars.map(([start, end]) => {
    const localMaxZValuePoint = point(end);
    const stockLineStart = lineString([start, end]);
    const stockLine = findFlowLine(featureCollection(isolinesWithoutClosest), localMaxZValuePoint, { zProperty });

    stockLine.features.unshift(stockLineStart);

    return stockLine;
  });
};
