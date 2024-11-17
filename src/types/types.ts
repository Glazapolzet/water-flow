import {
  Feature,
  MultiLineString as GeoJSONMultiLineString,
  MultiPolygon as GeoJSONMultiPolygon,
  Polygon as GeoJSONPolygon,
  GeoJsonProperties,
} from 'geojson';
import {
  Circle as OLCircle,
  LinearRing as OLLinearRing,
  MultiLineString as OLMultiLineString,
  MultiPolygon as OLMultiPolygon,
  Polygon as OLPolygon,
} from 'ol/geom';

export type Unpacked<T> = T extends Array<infer U> ? U : T extends ReadonlyArray<infer U> ? U : T;

export type OLBBoxLikeGeometry = OLLinearRing | OLPolygon | OLMultiLineString | OLMultiPolygon | OLCircle;
export type GeoJSONBBoxLikeGeometry = GeoJSONMultiLineString | GeoJSONPolygon | GeoJSONMultiPolygon;
export type TurfBBoxLikeGeometry = Feature<GeoJSONPolygon | GeoJSONMultiPolygon, GeoJsonProperties>;
