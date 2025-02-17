import clone from '@turf/clone';
import { featureCollection, lineString, point } from '@turf/helpers';
import { Feature, FeatureCollection, LineString, MultiLineString, Point } from 'geojson';
import { findAllPerpendicularsToLine } from './findAllPerpendicularsToLine';
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

    const pCoords: [number, number][] = findPerpendicularToLine(
      closestIsoline.geometry.coordinates[0] as [number, number][],
      currentMaxZValuePoint.geometry.coordinates as [number, number],
    );

    stockLine.features.push(lineString(pCoords));

    currentMaxZValuePoint = point(pCoords[1]);

    clonedIsolines.features = clonedIsolines.features.filter((feature) => feature !== closestIsoline);
  }

  return stockLine;
};

export const findFlowLines = (
  isolines: FeatureCollection<MultiLineString>,
  maxZValuePoint: Feature<Point>,
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  const clonedIsolines = clone(isolines);
  const stockLines: FeatureCollection<LineString>[] = [];

  const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(clonedIsolines, { zProperty });

  if (!closestIsoline) return stockLines;

  const pCoordsList: [number, number][][] = findAllPerpendicularsToLine(
    closestIsoline.geometry.coordinates[0] as [number, number][],
    maxZValuePoint.geometry.coordinates as [number, number],
  );

  clonedIsolines.features = clonedIsolines.features.filter((feature) => feature !== closestIsoline);

  const res = pCoordsList.map((pCoords) => {
    const localMaxZValuePoint = point(pCoords[1]);

    const stockLineStart = lineString(pCoords);
    const stockLine = findFlowLine(clonedIsolines, localMaxZValuePoint, { zProperty });

    stockLine.features.unshift(stockLineStart);

    return stockLine;
  });

  stockLines.push(...res);

  return stockLines;
};
