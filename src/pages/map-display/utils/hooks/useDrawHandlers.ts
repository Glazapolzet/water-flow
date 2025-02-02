import { makePointsFromBBox } from '@/utils/helpers';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSON } from 'ol/format';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import { useCallback } from 'react';

export const useDrawHandlers = (
  drawLayer: VectorLayer,
  setIsDrawEnd: (isDrawEnd: boolean) => void,
  setPoints: (points: FeatureCollection<Point>) => void,
) => {
  const g = new GeoJSON();

  const handleDrawStart = useCallback(() => {
    setIsDrawEnd(false);

    drawLayer?.getSource()?.clear();
  }, [drawLayer, setIsDrawEnd]);

  const handleDrawEnd = useCallback(
    (drawEvent: DrawEvent) => {
      setIsDrawEnd(true);

      const geometry = drawEvent?.feature.getGeometry();

      if (!geometry) {
        return;
      }

      const points = makePointsFromBBox(geometry.getExtent(), 20, { units: 'meters' });
      setPoints(points);

      drawLayer?.getSource()?.addFeatures(g.readFeatures(points));
    },
    [drawLayer, setPoints, setIsDrawEnd],
  );

  return { handleDrawStart, handleDrawEnd };
};
