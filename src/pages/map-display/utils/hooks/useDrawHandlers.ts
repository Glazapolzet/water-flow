import { Geometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';
import { useState } from 'react';

export const useDrawHandlers = () => {
  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<Geometry | undefined>(undefined);

  const handleDrawStart = () => {
    setIsDrawEnd(false);
    setGeometry(undefined);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsDrawEnd(true);
    setGeometry(drawEvent?.feature.getGeometry());
  };

  return { handleDrawStart, handleDrawEnd, isDrawEnd, geometry };
};
