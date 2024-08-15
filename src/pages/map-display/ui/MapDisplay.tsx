import { makeConrecIsolines, makeTurfIsolines } from '@/features/isolines';
import { OLGeometryTypes, OLMap } from '@/features/ol-map';
import { SettingsPanel } from '@/features/settings';
import { attributionSetting, drawInteractions, drawLayers, interactions, rasterLayers, view } from '@/utils/map';
import { GeoJSON } from 'ol/format';
import { Draw } from 'ol/interaction';
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

  const [isConfirmButtonVisible, setIsConfirmButtonVisible] = useState<boolean>(false);
  const [isolinesType, setIsolinesType] = useState<string | undefined>(undefined);
  const [isIsolineSplined, setIsolineSplined] = useState<boolean>(false);
  const [currentDraw, setCurrentDraw] = useState<Draw | undefined>(undefined);

  const OTMLayerName: string = RASTER_LAYERS_PROPERTIES.OpenTopoMap.name;
  const drawLayerName: string = VECTOR_LAYERS_PROPERTIES.draw.name;

  const OTMLayer = rasterLayers.get(OTMLayerName);
  const drawLayer = drawLayers.get(drawLayerName) as VectorLayer;

  const handleDrawStart = () => {
    setIsConfirmButtonVisible(false);

    clearLayerSource(drawLayer);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsConfirmButtonVisible(true);

    const geometry = drawEvent?.feature.getGeometry() as OLGeometryTypes;
    const geojson = new GeoJSON();

    if (!isolinesType) {
      return;
    }

    // console.log(geometry.getCoordinates()); //get bounds of figure
    console.log({ isolinesType, getInteractions: mapRef.current?.getInteractions() });

    const breaks = [0, 0.3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pointGrid = mockPointGridWithZVal(geojson.writeGeometryObject(geometry), { zProperty: 'zValue' });
    const isolineSettings = { pointGrid, breaks, splined: isIsolineSplined, options: { zProperty: 'zValue' } };

    const isolines = isolinesType === 'turf' ? makeTurfIsolines(isolineSettings) : makeConrecIsolines(isolineSettings);

    drawLayer?.getSource()?.addFeatures(geojson.readFeatures(isolines));
  };

  useEffect(() => {
    if (!currentDraw) {
      return;
    }

    currentDraw.on('drawstart', handleDrawStart);
    currentDraw.on('drawend', handleDrawEnd);

    return () => {
      currentDraw.un('drawstart', handleDrawStart);
      currentDraw.un('drawend', handleDrawEnd);
    };
  }, [currentDraw, isIsolineSplined, isolinesType]);

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
      layer.getProperties()?.name === event.target.value
        ? mapRef.current?.addLayer(layer)
        : mapRef.current?.removeLayer(layer);
    });
  };

  const handleFigureChange = (event: ChangeEvent<HTMLSelectElement>) => {
    drawInteractions.getArray().forEach((draw) => {
      draw.getProperties()?.name === event.target.value
        ? mapRef.current?.addInteraction(draw)
        : mapRef.current?.removeInteraction(draw);
    });

    const currentDraw = drawInteractions.get(event.target.value) as Draw;

    if (!currentDraw) {
      return;
    }

    currentDraw.un('drawstart', handleDrawStart);
    currentDraw.un('drawend', handleDrawEnd);

    setCurrentDraw(currentDraw);
  };

  const handleIsolinesTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (currentDraw) {
      currentDraw.un('drawstart', handleDrawStart);
      currentDraw.un('drawend', handleDrawEnd);
    }

    setIsolinesType(event.target.value);
  };

  const handleSplineChange = () => {
    if (currentDraw) {
      currentDraw.un('drawstart', handleDrawStart);
      currentDraw.un('drawend', handleDrawEnd);
    }

    setIsolineSplined(!isIsolineSplined);
  };

  const handleConfirmButtonClick = () => {
    return;
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
          onChange: handleFigureChange,
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
          isVisible: isConfirmButtonVisible,
        }}
      />

      <OLMap options={mapOptions} onMount={handleMapMount} />
    </section>
  );
};
