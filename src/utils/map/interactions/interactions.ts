import { Link, Snap } from 'ol/interaction';
import { Interactions } from '../helpers/Interactions';
import { DRAW_VECTOR_SOURCE } from '../layers/souces';

const INTERACTION_PROPERTIES = {
  snap: {
    name: 'snap',
  },
  link: {
    name: 'link',
  },
};

const snap = new Snap({
  source: DRAW_VECTOR_SOURCE,
});

snap.setProperties(INTERACTION_PROPERTIES.snap);

const link = new Link();

link.setProperties(INTERACTION_PROPERTIES.link);

// The snap interaction must be added after the Modify and Draw interactions
// in order for its map browser event handlers to be fired first. Its handlers
// are responsible of doing the snapping.
export const interactions = new Interactions([link, snap]);
