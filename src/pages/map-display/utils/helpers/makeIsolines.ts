import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';

type IsolinesSettings = Parameters<typeof makeTurfIsolines>[0] | Parameters<typeof makeConrecIsolines>[0];

export const makeIsolines = (isolinesType: string, isolinesSettings: IsolinesSettings) => {
  if (isolinesType === 'turf') {
    return makeTurfIsolines(isolinesSettings);
  }

  if (isolinesType === 'conrec') {
    return makeConrecIsolines(isolinesSettings);
  }

  return null;
};
