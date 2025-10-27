import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import AdminLayout from '../layout/AdminLayout/AdminLayout';
import ProtectedRoute from 'components/auth/ProtectedRoute';

// render - dashboard pages
const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));

// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
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
                    path: '/',
                    element: <DefaultPages />
                }
            ]
        }
    ]
};

export default NavigationRoutes;
