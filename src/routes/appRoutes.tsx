import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const MapDisplay = lazy(() => import('@/pages/map-display'));

export const appRoutes: RouteObject = {
  id: 'map',
  path: '/water-flow/',
  element: <MapDisplay />,
};
