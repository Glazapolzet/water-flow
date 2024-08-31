import {
  MultiLineString as GeoJSONMultiLineString,
  MultiPolygon as GeoJSONMultiPolygon,
  Polygon as GeoJSONPolygon,
} from 'geojson';
import { Circle, LinearRing, MultiLineString, MultiPolygon, Polygon } from 'ol/geom';

export type Unpacked<T> = T extends Array<infer U> ? U : T extends ReadonlyArray<infer U> ? U : T;

export type OLBBoxLikeGeometry = LinearRing | Polygon | MultiLineString | MultiPolygon | Circle;
export type GeoJSONBBoxLikeGeometry = GeoJSONMultiLineString | GeoJSONPolygon | GeoJSONMultiPolygon;
