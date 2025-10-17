import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import AdminLayout from '../layout/AdminLayout/AdminLayout'

// render - other pages
const OtherSamplePage = Loadable(lazy(() => import('views/SamplePage')));

// ==============================|| OTHER ROUTING ||============================== //

const OtherRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: 'other',
          children: [
            {
              path: 'sample-page',
              element: <OtherSamplePage />
            }
          ]
        }
      ]
    }
  ]
};

export default OtherRoutes;
