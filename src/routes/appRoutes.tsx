import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Home = lazy(() => import('@/pages/Home'));

export const appRoutes: RouteObject = {
  id: 'i',
  path: '/',
  element: <Home />,
};
