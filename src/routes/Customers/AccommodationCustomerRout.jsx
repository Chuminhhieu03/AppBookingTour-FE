import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - bootstrap table pages
const AccommodationCustomerDefault = Loadable(lazy(() => import('views/Customers/Accommodations/Default')));

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
                    children: [
                        {
                            path: 'default',
                            element: <AccommodationCustomerDefault />
                        }
                    ]
                }
            ]
        }
    ]
};

export default AccommodationCustomerRoutes;
