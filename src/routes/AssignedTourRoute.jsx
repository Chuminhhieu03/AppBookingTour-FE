import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

// Lazy load components
const AssignedTourList = Loadable(lazy(() => import('views/AssignedTour/AssignedTourList')));

const AssignedTourRoute = {
    path: '/',
    children: [
        {
            path: 'admin',
            element: (
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: 'assigned-tour',
                    children: [
                        {
                            path: 'list',
                            element: <AssignedTourList />
                        }
                    ]
                }
            ]
        }
    ]
};

export default AssignedTourRoute;
