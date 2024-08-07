import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Home = lazy(() => import('@/pages/home'));

export const appRoutes: RouteObject = {
  id: 'i',
  path: '/',
  element: <Home />,
};
