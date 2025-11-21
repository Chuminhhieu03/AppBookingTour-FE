import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - tour pages
const TourList = Loadable(lazy(() => import('views/Customers/Tours/TourList')));

const TourCustomerRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <CustomerLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: 'tours',
                    element: <TourList />
                }
            ]
        }
    ]
};

export default TourCustomerRoutes;
