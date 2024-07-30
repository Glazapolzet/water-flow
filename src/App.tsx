import { Suspense } from 'react';

import '@/theme';

import { Loader } from '@/components';
import Router from '@/routes';

const App = () => (
  <Suspense fallback={<Loader />}>
    <Router />
  </Suspense>
);

export default App;
