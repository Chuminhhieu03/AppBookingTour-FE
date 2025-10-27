import { lazy } from 'react';

// project-imports
import AdminLayout from '../layout/AdminLayout/AdminLayout';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';

// render - bootstrap table pages
const BootstrapTableBasic = Loadable(lazy(() => import('views/table/bootstrap-table/BasicTable')));

// ==============================|| TABLES ROUTING ||============================== //

const TablesRoutes = {
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
                    path: 'tables/bootstrap-table',
                    children: [
                        {
                            path: 'basic-table',
                            element: <BootstrapTableBasic />
                        }
                    ]
                }
            ]
        }
    ]
};

export default TablesRoutes;
