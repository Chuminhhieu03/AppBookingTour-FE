import { lazy } from 'react';

// project-imports
import AdminLayout from '../layout/AdminLayout/AdminLayout';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';

// render - chart pages
const ApexChart = Loadable(lazy(() => import('views/charts/ApexChart')));

// render - map pages
const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const ChartMapRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'charts',
          children: [
            {
              path: 'apex-chart',
              element: <ApexChart />
            }
          ]
        },
        {
          path: 'map',
          children: [
            {
              path: 'google-map',
              element: <GoogleMaps />
            }
          ]
        }
      ]
    }
  ]
};

export default ChartMapRoutes;
