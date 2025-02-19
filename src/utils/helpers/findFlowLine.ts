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
