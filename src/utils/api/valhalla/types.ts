type LonLatCoordinates = {
  lat: number;
  lon: number;
};

type Range = number;
type Height = number | null;

export interface TElevation {
  id?: string;
  range?: boolean;
  shape_format: 'polyline5' | 'polyline6';
  shape?: LonLatCoordinates[];
  encoded_polyline?: string;
  resample_distance?: number;
  height_precision?: number;
}

export interface TElevationResponse {
  id?: string;
  shape?: LonLatCoordinates[];
  encoded_polyline?: string;
  range_height?: [x: Range, y: Height][];
  height?: [Height][];
  warnings?: unknown;
}

export interface TElevationError {
  error_code: number;
  error: string;
  status_code: number;
  status: string;
}
