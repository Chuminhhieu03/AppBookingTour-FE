import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

// render - customer home page
const CustomerHome = Loadable(lazy(() => import('views/Customers/Home/CustomerHome')));

const HomeCustomerRoute = {
    path: '/',
    children: [
        {
            path: '/',
            element: <CustomerLayout />,
            children: [
                {
                    path: '',
                    element: <CustomerHome />
                },
                {
                    path: 'home',
                    element: <CustomerHome />
                }
            ]
        }
    ]
};

export default HomeCustomerRoute;
