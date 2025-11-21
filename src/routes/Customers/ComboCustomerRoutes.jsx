import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - combo pages
const ComboList = Loadable(lazy(() => import('views/Customers/Combos/ComboList')));

const ComboCustomerRoutes = {
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
                    path: 'combos',
                    element: <ComboList />
                }
            ]
        }
    ]
};

export default ComboCustomerRoutes;
