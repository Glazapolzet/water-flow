import { FC } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './appRoutes';

const Router: FC = () => <RouterProvider router={createBrowserRouter([appRoutes])} />;

export default Router;
