import { IsolinesTypeLiteral, makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { GeoJSONBBoxLikeGeometry, OLBBoxLikeGeometry } from '@/types';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import { mockPointGridWithZVal } from '../../../utils/mockPointGrid';

export const clearLayerSource = (layer: VectorLayer) => {
  layer?.getSource()?.clear();
};

export const drawIsolines = (
  layer: VectorLayer,
  geometry: OLBBoxLikeGeometry,
  options?: {
    isolinesType?: IsolinesTypeLiteral;
    isIsolinesSplined?: boolean;
    bboxWrap?: boolean;
  },
) => {
  const g = new GeoJSON();
  const geoJSON = g.writeGeometryObject(geometry) as GeoJSONBBoxLikeGeometry;

  const breaks = [0, 0.3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const pointGrid = mockPointGridWithZVal(geoJSON, { zProperty: 'zValue' });

  const { isolinesType = 'turf', isIsolinesSplined = false, bboxWrap = false } = options ?? {};
  const isolineSettings = { pointGrid, breaks, splined: isIsolinesSplined, options: { zProperty: 'zValue' } };

  let isolines;

  switch (isolinesType) {
    case 'turf':
      isolines = makeTurfIsolines(isolineSettings);
      break;
    case 'conrec':
      isolines = makeConrecIsolines(isolineSettings);
      break;
  }

  if (bboxWrap) {
    layer?.getSource()?.addFeatures(g.readFeatures(bboxPolygon(bbox(isolines))));
  }

  layer?.getSource()?.addFeatures(g.readFeatures(isolines));
};
