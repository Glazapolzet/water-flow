import { IsolinesTypeLiteral, makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { OLGeometryTypes } from '@/features/ol-map';
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
  geometry: OLGeometryTypes,
  options?: {
    isolinesType?: IsolinesTypeLiteral;
    isIsolinesSplined?: boolean;
    bboxWrap?: boolean;
  },
) => {
  const geojson = new GeoJSON();
  const geoJSON = geojson.writeGeometryObject(geometry);

  const breaks = [0, 0.3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const pointGrid = mockPointGridWithZVal(geoJSON, { zProperty: 'zValue' });

  const { isolinesType = 'turf', isIsolinesSplined = false, bboxWrap = false } = options ?? {};
  const isolineSettings = { pointGrid, breaks, splined: isIsolinesSplined, options: { zProperty: 'zValue' } };

  const isolines = isolinesType === 'turf' ? makeTurfIsolines(isolineSettings) : makeConrecIsolines(isolineSettings);

  if (bboxWrap) {
    layer?.getSource()?.addFeatures(geojson.readFeatures(bboxPolygon(bbox(isolines))));
  }

  layer?.getSource()?.addFeatures(geojson.readFeatures(isolines));
};
