import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { OLGeometryTypes, OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { GeoJSON } from 'ol/format';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearLayerSource } from '../utils/drawEvents';
import { mockPointGridWithZVal } from '../utils/mockPointGrid';
import { RASTER_LAYERS_PROPERTIES, VECTOR_LAYERS_PROPERTIES } from '../utils/properties';
import { FIGURE_SELECT_OPTIONS, ISOLINE_SELECT_OPTIONS, LAYER_SELECT_OPTIONS } from '../utils/settings';
import styles from './MapDisplay.module.scss';

export const MapDisplay = () => {
  const mapRef = useRef<Map | undefined>(undefined);

  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<string | undefined>(undefined);
  const [isIsolineSplined, setIsolineSplined] = useState<boolean>(false);

  const [geometry, setGeometry] = useState<OLGeometryTypes | undefined>(undefined);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  const handleDrawStart = (_drawEvent: DrawEvent) => {
    setIsDrawEnd(false);
    clearLayerSource(drawLayer);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsDrawEnd(true);
    setGeometry(drawEvent?.feature.getGeometry() as OLGeometryTypes);
  };

  useEffect(() => {
    drawInteractions.getArray().forEach((draw) => {
      draw.on('drawstart', handleDrawStart);
      draw.on('drawend', handleDrawEnd);
    });

    return () =>
      drawInteractions.getArray().forEach((draw) => {
        draw.un('drawstart', handleDrawStart);
        draw.un('drawend', handleDrawEnd);
      });
  }, []);

  const mapOptions = useMemo(() => {
    return {
      layers: [drawLayer, OTMLayer],
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

  const handleLayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    rasterLayers.getArray().forEach((layer) => {
      layer.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeLayer(layer)
        : mapRef.current?.addLayer(layer);
    });
  };

  const handleSelectionFigureChange = (event: ChangeEvent<HTMLSelectElement>) => {
    drawInteractions.getArray().forEach((draw) => {
      draw.getProperties()?.name !== event.target.value
        ? mapRef.current?.removeInteraction(draw)
        : mapRef.current?.addInteraction(draw);
      // setCurrentDraw(drawInteractions.get(event.target.value) as Draw);
    });
  };

  const handleIsolinesTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIsolinesType(event.target.value);
  };

  const handleSplineChange = () => {
    setIsolineSplined(!isIsolineSplined);
  };

  const handleConfirmButtonClick = () => {
    const geojson = new GeoJSON();

    if (!isolinesType || !geometry) {
      return;
    }

    clearLayerSource(drawLayer);

    // console.log(geometry.getCoordinates()); //get bounds of figure
    const geometryJSON = geojson.writeGeometryObject(geometry);

    const breaks = [0, 0.3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pointGrid = mockPointGridWithZVal(geometryJSON, { zProperty: 'zValue' });
    const isolineSettings = { pointGrid, breaks, splined: isIsolineSplined, options: { zProperty: 'zValue' } };

    const isolines = isolinesType === 'turf' ? makeTurfIsolines(isolineSettings) : makeConrecIsolines(isolineSettings);

    console.log({ bbox: bboxPolygon(bbox(pointGrid)), geometryJSON });

    drawLayer?.getSource()?.addFeatures(geojson.readFeatures(bboxPolygon(bbox(isolines))));
    drawLayer?.getSource()?.addFeatures(geojson.readFeatures(isolines));
  };

  return (
    <section className={styles.mapDisplay}>
      <SettingsPanel
        mapRef={mapRef}
        layerSelect={{
          heading: 'Active layer',
          defaultValue: OTMLayerName,
          options: LAYER_SELECT_OPTIONS,
          onChange: handleLayerChange,
        }}
        figureSelect={{
          heading: 'Selection type',
          defaultValue: '',
          options: FIGURE_SELECT_OPTIONS,
          onChange: handleSelectionFigureChange,
        }}
        isolineSelect={{
          heading: 'Isoline method',
          defaultValue: '',
          options: ISOLINE_SELECT_OPTIONS,
          onChange: handleIsolinesTypeChange,
          splineCheckbox: {
            onChange: handleSplineChange,
            isChecked: isIsolineSplined,
          },
        }}
        confirmButton={{
          onClick: handleConfirmButtonClick,
          isVisible: isDrawEnd,
        }}
      />

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
