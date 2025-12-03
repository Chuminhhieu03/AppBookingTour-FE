import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - combo pages
const ComboList = Loadable(lazy(() => import('views/Customers/Combos/ComboList')));
const ComboDetail = Loadable(lazy(() => import('views/Customers/Combos/ComboDetail')));

const ComboCustomerRoute = {
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
                },
                {
                    path: 'combos/:id',
                    element: <ComboDetail />
                }
            ]
        }
    ]
};

export default ComboCustomerRoute;
