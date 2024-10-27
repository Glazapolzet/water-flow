import { Suspense } from 'react';

import '@/theme';

import { CustomSpinner } from '@/components';
import Router from '@/routes';

const App = () => (
  <Suspense fallback={<CustomSpinner />}>
    <Router />
  </Suspense>
);

export default App;
