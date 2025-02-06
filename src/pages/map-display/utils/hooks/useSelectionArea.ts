import { DrawInteractions } from '@/features/map-tools';
import { Map } from 'ol';
import { MutableRefObject, useEffect, useState } from 'react';

export const useSelectionArea = (
  mapRef: MutableRefObject<Map | undefined>,
  defaultSelectionArea: string,
  drawInteractions: DrawInteractions,
) => {
  const [selectionArea, setSelectionArea] = useState<string>(defaultSelectionArea);

  useEffect(() => {
    drawInteractions.getArray().forEach((draw) => {
      draw.getProperties()?.name !== selectionArea
        ? mapRef.current?.removeInteraction(draw)
        : mapRef.current?.addInteraction(draw);
    });
  }, [selectionArea]);

  return { selectionArea, setSelectionArea };
};
