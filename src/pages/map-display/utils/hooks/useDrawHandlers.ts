import { Geometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';
import { useState } from 'react';

export const useDrawHandlers = () => {
  const [isDrawStart, setIsDrawStart] = useState<boolean>(false);
  const [isDrawEnd, setIsDrawEnd] = useState<boolean>(false);
  const [geometry, setGeometry] = useState<Geometry | undefined>(undefined);

  const handleDrawStart = () => {
    setIsDrawStart(true);
    setIsDrawEnd(false);
    setGeometry(undefined);
  };

  const handleDrawEnd = (drawEvent: DrawEvent) => {
    setIsDrawStart(false);
    setIsDrawEnd(true);
    setGeometry(drawEvent?.feature.getGeometry());
  };

  return { handleDrawStart, handleDrawEnd, isDrawStart, isDrawEnd, geometry };
};
