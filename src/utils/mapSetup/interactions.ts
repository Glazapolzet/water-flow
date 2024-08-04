import { Draw, Link, Snap } from 'ol/interaction';
import { drawLayer } from './vectorLayers';

export const polygon = new Draw({
  source: drawLayer.getSource() ?? undefined,
  type: 'Polygon',
  snapTolerance: 5,
});

export const snap = new Snap({
  source: drawLayer.getSource() ?? undefined,
});

export const link = new Link();
