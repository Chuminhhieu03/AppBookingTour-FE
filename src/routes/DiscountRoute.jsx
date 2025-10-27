import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

const DiscountDefault = Loadable(lazy(() => import('views/Discounts/Default')));
const DiscountAddNew = Loadable(lazy(() => import('views/Discounts/AddNew')));
const DiscountDisplay = Loadable(lazy(() => import('views/Discounts/Display')));
const DiscountEdit = Loadable(lazy(() => import('views/Discounts/Edit')));

const DiscountRoute = {
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
                    path: 'sale',
                    children: [
                        {
                            path: 'discount',
                            children: [
                                {
                                    index: true,
                                    element: <DiscountDefault />
                                },
                                {
                                    path: 'addnew',
                                    element: <DiscountAddNew />
                                },
                                {
                                    path: 'display/:id',
                                    element: <DiscountDisplay />
                                },
                                {
                                    path: 'edit/:id',
                                    element: <DiscountEdit />
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default DiscountRoute;
