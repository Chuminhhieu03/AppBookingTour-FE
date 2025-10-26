import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

// render - dashboard pages
const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));

// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: <AdminLayout />,
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
