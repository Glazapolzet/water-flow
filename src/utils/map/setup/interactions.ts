import { Link, Snap } from 'ol/interaction';
import { Interactions } from '../helpers';
import { drawLayer } from '../layers/vectorLayers';

const INTERACTION_PROPERTIES = {
  snap: {
    name: 'snap',
  },
  link: {
    name: 'link',
  },
};

const snap = new Snap({
  source: drawLayer.getSource() ?? undefined,
});

snap.setProperties(INTERACTION_PROPERTIES.snap);

const link = new Link();

link.setProperties(INTERACTION_PROPERTIES.link);

// The snap interaction must be added after the Modify and Draw interactions
// in order for its map browser event handlers to be fired first. Its handlers
// are responsible of doing the snapping.
export const interactions = new Interactions([snap, link]);
