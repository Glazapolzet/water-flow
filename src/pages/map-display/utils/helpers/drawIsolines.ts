import { vallhalaApi } from '@/api/valhalla';
import { IsolinesTypeLiteral, makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { GeoJSONBBoxLikeGeometry, OLBBoxLikeGeometry } from '@/types';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import pointGrid from '@turf/point-grid';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import { toLonLat } from 'ol/proj';
import { makeValhallaMappings } from './mappings';

const makeLonLatList = (points: FeatureCollection<Point, GeoJsonProperties>, options: { zProperty: string }) => {
  const lonLatList = [];
  const { zProperty } = options;

  for (let i = 0; i < points.features.length; i++) {
    if (points.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    const [lon, lat] = toLonLat(points.features[i].geometry.coordinates);

    lonLatList.push({ lon, lat });
  }

  return lonLatList;
};

const makePointsFromBBox = (geoJSON: GeoJSONBBoxLikeGeometry, pointsDelta: number) => {
  const bb = bbox(geoJSON);
  if (geoJSON.type === 'MultiLineString') {
    return pointGrid(bb, pointsDelta, { units: 'kilometers' });
  }

  console.log(bb);

  return pointGrid(bb, pointsDelta, { units: 'kilometers' });
};

const getPointsElevationData = async (
  points: FeatureCollection<Point, GeoJsonProperties>,
  options: { zProperty: string },
) => {
  const { zProperty } = options;

  const lonLatList = makeLonLatList(points, { zProperty });
  const mappedData = makeValhallaMappings(lonLatList);

  const elevationData = await vallhalaApi.getElevation(mappedData);

  return elevationData;
};

const makePointsWithZValues = (
  points: FeatureCollection<Point, GeoJsonProperties>,
  ZValues: [number | null][],
  options: { zProperty: string },
) => {
  const { zProperty } = options;
  const pointsWithZ = JSON.parse(JSON.stringify(points));

  for (let i = 0; i < pointsWithZ.features.length; i++) {
    if (pointsWithZ.features[i].properties?.[`${zProperty}`]) {
      continue;
    }

    pointsWithZ.features[i].properties![`${zProperty}`] = ZValues[i];
  }

  return pointsWithZ;
};

export const drawIsolines = async (
  layer: VectorLayer,
  geometry: OLBBoxLikeGeometry,
  options?: {
    isolinesType?: IsolinesTypeLiteral;
    isIsolinesSplined?: boolean;
    bboxWrap?: boolean;
  },
) => {
  //TODO: fixme!
  const Z_PROPERTY_NAME = 'zValue';

  const g = new GeoJSON();
  const geoJSON = g.writeGeometryObject(geometry) as GeoJSONBBoxLikeGeometry;

  const points = makePointsFromBBox(geoJSON, 200);
  const elevationData = await getPointsElevationData(points, { zProperty: Z_PROPERTY_NAME });
  const pointsWithZ = makePointsWithZValues(points, elevationData.height, { zProperty: Z_PROPERTY_NAME });
  // const pointsMock = makeMockPointsWithZ(geoJSON, { zProperty: Z_PROPERTY_NAME });

  // console.log({ pointsMock });
  console.log({ pointsWithZ });

  const { isolinesType = 'turf', isIsolinesSplined = false, bboxWrap = false } = options ?? {};

  const isolineSettings = {
    points: pointsWithZ,
    breaksDelta: 10,
    splined: isIsolinesSplined,
    isolinesOptions: { zProperty: Z_PROPERTY_NAME },
  };

  let isolines;

  switch (isolinesType) {
    case 'turf':
      isolines = makeTurfIsolines(isolineSettings);
      break;
    case 'conrec':
      isolines = makeConrecIsolines(isolineSettings);
      break;
  }

  console.log({ isolines });
  // console.log({
  //   mock: makeTurfIsolines({
  //     points: pointsMock,
  //     breaks,
  //     splined: isIsolinesSplined,
  //     isolinesOptions: { zProperty: Z_PROPERTY_NAME },
  //   }),
  // });

  if (bboxWrap) {
    layer?.getSource()?.addFeatures(g.readFeatures(bboxPolygon(bbox(isolines))));
  }

  layer?.getSource()?.addFeatures(g.readFeatures(isolines));
};
