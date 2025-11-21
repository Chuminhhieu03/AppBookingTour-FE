import { lazy } from 'react';

// project-imports
import AdminLayout from '../layout/AdminLayout/AdminLayout';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';

// ==============================|| FORMS ROUTING ||============================== //

const FormsRoutes = {
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
                // Forms routes can be added here when needed
            ]
        }
    ]
};

export default FormsRoutes;
