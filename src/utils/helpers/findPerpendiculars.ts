import clone from '@turf/clone';
import { featureCollection, lineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { Feature, FeatureCollection, LineString, MultiLineString, Point } from 'geojson';
import { findFeatureWithMaxZValue } from './findFeatureWithMaxZValue';

export const findPerpendiculars = (
  isolines: FeatureCollection<MultiLineString>,
  maxZValuePoint: Feature<Point>,
  options: { zProperty: string },
): FeatureCollection<LineString> => {
  const { zProperty } = options;

  const clonedIsolines = clone(isolines);

  const perpendiculars = featureCollection<LineString>([]);

  let currentMaxZValuePoint = maxZValuePoint;

  while (clonedIsolines.features.length > 0) {
    const closestIsoline = findFeatureWithMaxZValue<MultiLineString>(clonedIsolines, { zProperty });

    if (!closestIsoline) break;

    // const line = lineString(closestIsoline.geometry.coordinates[0]);

    const nearestPoint = nearestPointOnLine(closestIsoline, currentMaxZValuePoint, {
      units: 'meters',
    });
    // const dist = pointToLineDistance(currentMaxZValuePoint, line, {
    //   units: 'meters',
    // });

    // console.log({ dist1: distance(nearestPoint, currentMaxZValuePoint, { units: 'meters' }), dist2: dist });

    const perpendicular = lineString([currentMaxZValuePoint.geometry.coordinates, nearestPoint.geometry.coordinates]);

    perpendiculars.features.push(perpendicular);

    currentMaxZValuePoint = nearestPoint;

    clonedIsolines.features = clonedIsolines.features.filter((feature) => feature !== closestIsoline);
  }

  // const finalPerpendicular = lineString([
  //   currentMaxZValuePoint.geometry.coordinates,
  //   nearestPointToBoundingBox.geometry.coordinates,
  // ]);

  // perpendiculars.features.push(finalPerpendicular);

  return perpendiculars;
};
