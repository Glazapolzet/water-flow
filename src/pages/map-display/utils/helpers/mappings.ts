export const makeValhallaMappings = (
  shape: {
    lon: number;
    lat: number;
  }[],
  options?: {
    id?: string;
    range?: boolean;
    shape_format?: 'polyline5' | 'polyline6';
    encoded_polyline?: string;
    resample_distance?: number;
    height_precision?: number;
  },
) => {
  const {
    id,
    range = false,
    shape_format = 'polyline6',
    encoded_polyline,
    resample_distance,
    height_precision,
  } = options ?? {};

  return {
    id,
    range,
    shape_format,
    shape,
    encoded_polyline,
    resample_distance,
    height_precision,
  };
};
