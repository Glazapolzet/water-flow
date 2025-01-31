import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { FeatureCollection, Point } from 'geojson';

export const makeIsolines = async (
  points: FeatureCollection<Point, { [zProperty: string]: number | null }>,
  isolinesType: string,
  options?: {
    zProperty?: string;
    isIsolinesSplined?: boolean;
  },
) => {
  const { zProperty = 'zValue', isIsolinesSplined = false } = options ?? {};

  const isolineSettings = {
    points: points,
    breaksDelta: 20,
    splined: isIsolinesSplined,
    isolinesOptions: { zProperty },
  };

  const isolines = isolinesType === 'turf' ? makeTurfIsolines(isolineSettings) : makeConrecIsolines(isolineSettings);

  return isolines;
};
