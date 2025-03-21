import { Link, Snap } from 'ol/interaction';

import { Interactions } from '@/features/map-tools';

import { DRAW_SOURCE } from '../layers/souces';

const properties = {
  snap: {
    name: 'snap',
  },
  link: {
    name: 'link',
  },
};

const snap = new Snap({
  source: DRAW_SOURCE,
});

snap.setProperties(properties.snap);

const link = new Link();

link.setProperties(properties.link);

// The snap interaction must be added after the Modify and Draw interactions
// in order for its map browser event handlers to be fired first. Its handlers
// are responsible of doing the snapping.
export const interactions = new Interactions([link, snap]);
