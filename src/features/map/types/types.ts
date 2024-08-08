import { Circle, LinearRing, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';

export type OLGeometryTypes =
  | Point
  | LineString
  | LinearRing
  | Polygon
  | MultiPoint
  | MultiLineString
  | MultiPolygon
  | Circle;
