import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - accommodation pages
const AccommodationList = Loadable(lazy(() => import('views/Customers/Accommodations/AccommodationList')));

const AccommodationCustomerRoutes = {
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
                    path: 'accommodations',
                    element: <AccommodationList />
                }
            ]
        }
    ]
};

export default AccommodationCustomerRoutes;
