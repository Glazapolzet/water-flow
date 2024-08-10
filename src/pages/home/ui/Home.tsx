import { makeTurfSplinedIsolines, OLGeometryTypes, OLMap } from '@/features/map';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import bbox from '@turf/bbox';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSON } from 'ol/format';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { mockPointGridWithZVal, RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { DRAW_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './Home.module.scss';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';

export const Home = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isConfirmAreaButtonVisible, setConfirmAreaButtonVisible] = useState<boolean>(false);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  // const d = new VectorLayer({
  //   source: new VectorSource(),
  //   style: {
  //     'fill-color': 'rgba(255, 255, 255, 0.0)',
  //     'stroke-color': 'rgba(245, 75, 66, 0.7)',
  //     'stroke-width': 1,
  //   },
  //   zIndex: 2,
  // });

  const mapOptions = useMemo(() => {
    return {
      layers: [OTMLayer, drawLayer],
      controls: attributionSetting,
      view: view,
    };
  }, [OTMLayerName, drawLayerName]);

  const handleMapMount = useCallback((map: Map) => {
    mapRef.current = map;

    interactions.getArray().forEach((interaction) => map.addInteraction(interaction));

    // map.on('click', (event) => {
    //   const clickedCoordinate = event.coordinate;
    //   console.log('Clicked Coordinate:', toLonLat(clickedCoordinate), clickedCoordinate);
    // });
  }, []);

  const handleLayerSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    rasterLayers.getArray().forEach((layer) => {
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.addLayer(layer)
        : mapRef.current?.removeLayer(layer);
    });
  };

  const handleDrawSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!event.target.value) {
      drawInteractions.getArray().forEach((drawInteraction) => {
        mapRef.current?.removeInteraction(drawInteraction);
      });

      return;
    }

    drawInteractions.getArray().forEach((drawInteraction) => {
      drawInteraction.getProperties()?.name === event.target.value
        ? mapRef.current?.addInteraction(drawInteraction)
        : mapRef.current?.removeInteraction(drawInteraction);
    });

    const currentDrawInteraction = drawInteractions.get(event.target.value) as Draw;

    currentDrawInteraction.on('drawstart', () => {
      setConfirmAreaButtonVisible(false);

      drawLayer?.getSource()?.clear();
      // mapRef.current?.removeLayer(d);
      // d.getSource()?.clear();
    });

    currentDrawInteraction.on('drawend', (event: DrawEvent) => {
      setConfirmAreaButtonVisible(true);

      const geometry = event?.feature.getGeometry() as OLGeometryTypes;

      const formatter = new GeoJSON();

      // console.log(geometry.getCoordinates()); //get bounds of figure

      const geoJSON = formatter.writeGeometryObject(geometry);

      const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const pointGrid = mockPointGridWithZVal(geoJSON);

      console.log(bbox(pointGrid));

      const toConrecMatrix = (pointGrid: FeatureCollection<Point>, options: { zProperty?: string }) => {
        const features = pointGrid.features;

        const getZProperty = (index: number) => {
          return options.zProperty
            ? features[index]?.properties?.[options.zProperty]
            : features[index].geometry.coordinates[2];
        };

        const firstZ = getZProperty(0);

        const matrix: number[][] = Array(features.length)
          .fill(0)
          .map(() => Array(features.length).fill(0));

        matrix[0][0] = firstZ;

        let xIndex = 0;
        let yIndex = 0;

        for (let i = 1; i < features.length; i++) {
          const [currX, currY] = features[i].geometry.coordinates;
          const [prevX, prevY] = features[i - 1].geometry.coordinates;

          const dx = currX - prevX;
          const dy = currY - prevY;

          // console.log({ prevX, currX, dx, iszero: dx === 0 });
          // console.log({ prevY, currY, dy, iszero: dy === 0 });

          const z = getZProperty(i);

          if (dx === 0) {
            yIndex += 1;
          }

          if (dy <= 0) {
            xIndex += 1;
            yIndex = 0;
          }

          console.log({ xIndex, yIndex });

          matrix[yIndex][xIndex] = z;
        }

        return matrix;
      };

      console.log(toConrecMatrix(pointGrid, { zProperty: 'z' }));

      // const conrec = new Conrec([
      //   [0, 1, 2],
      //   [3, 2, 1],
      // ]);

      // console.log(conrec.drawContour({ contourDrawer: 'basic' }));

      const splinedIsolines = makeTurfSplinedIsolines(
        { pointGrid, breaks, options: { zProperty: 'z' } },
        { sharpness: 0.9 },
      );

      drawLayer.getSource()?.addFeatures(formatter.readFeatures(splinedIsolines));

      // mapRef.current?.addLayer(d);
      // d.getSource()?.addFeatures(splinedIso2);
    });
  };

  return (
    <section className={styles.home}>
      <SettingsPanel
        mapRef={mapRef}
        layerSelect={{
          defaultValue: OTMLayerName,
          options: LAYER_SELECT_OPTIONS,
          onChange: handleLayerSelectChange,
        }}
        drawSelect={{
          defaultValue: '',
          options: DRAW_SELECT_OPTIONS,
          onChange: handleDrawSelectChange,
        }}
        showConfirmAreaButton={isConfirmAreaButtonVisible}
      />

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
