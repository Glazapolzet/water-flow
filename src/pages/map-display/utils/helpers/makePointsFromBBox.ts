import { Units } from '@turf/helpers';
import pointGrid from '@turf/point-grid';
import { toMercator } from '@turf/projection';
import { Feature, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';
import { toLonLat } from 'ol/proj';

export const makePointsFromBBox = (
  bbox: [number, number, number, number] | number[],
  cellSide: number,
  options?:
    | {
        units?: Units;
        mask?: Feature<Polygon | MultiPolygon>;
        properties?: GeoJsonProperties | undefined;
      }
    | undefined,
) => {
  const [x1, y1] = toLonLat([bbox[0], bbox[1]]) as [number, number];
  const [x2, y2] = toLonLat([bbox[2], bbox[3]]) as [number, number];

  const bb_lonlat: [number, number, number, number] = [x1, y1, x2, y2];

  return toMercator(pointGrid(bb_lonlat, cellSide, options));
};
