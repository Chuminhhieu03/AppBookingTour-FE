import { lazy } from 'react';
import Loadable from 'components/Loadable';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

const ComboDetail = Loadable(lazy(() => import('views/Customers/Combos/ComboDetail')));

const ComboCustomerRoute = {
    path: '/',
    element: <CustomerLayout />,
    children: [
        {
            path: 'combos/:id',
            element: <ComboDetail />
        }
    ]
};

export default ComboCustomerRoute;
