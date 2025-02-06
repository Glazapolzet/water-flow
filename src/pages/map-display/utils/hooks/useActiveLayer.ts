import { Layers } from '@/features/map-tools';
import { Map } from 'ol';
import { Layer } from 'ol/layer';
import { MutableRefObject, useEffect, useState } from 'react';

export const useActiveLayer = <T extends Layer>(
  mapRef: MutableRefObject<Map | undefined>,
  defaultLayer: string,
  rasterLayers: Layers<T>,
) => {
  const [activeLayer, setActiveLayer] = useState<string>(defaultLayer);

  useEffect(() => {
    rasterLayers.getArray().forEach((layer: Layer) => {
      layer.getProperties()?.name !== activeLayer
        ? mapRef.current?.removeLayer(layer)
        : mapRef.current?.addLayer(layer);
    });
  }, [activeLayer, mapRef, rasterLayers]);

  return { activeLayer, setActiveLayer };
};
