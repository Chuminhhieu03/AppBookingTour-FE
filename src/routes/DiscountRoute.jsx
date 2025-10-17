import { lazy } from 'react';
import Loadable from 'components/Loadable';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

const DiscountDefault = Loadable(lazy(() => import('views/Discounts/Default')));

const DiscountRoute = {
    path: '/',
    children: [
        {
            path: 'admin',
            element: <AdminLayout />,
            children: [
                {
                    path: 'sale',
                    children: [
                        {
                            path: 'discount',
                            element: <DiscountDefault />
                        }
                    ]
                }
            ]
        }
    ]
};

export default DiscountRoute;
