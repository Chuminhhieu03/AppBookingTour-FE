import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from 'layout/AdminLayout/AdminLayout';

const ComboDefault = Loadable(lazy(() => import('views/Combos/Default')));
const ComboAddnew = Loadable(lazy(() => import('views/Combos/Addnew')));
const ComboDisplay = Loadable(lazy(() => import('views/Combos/Display')));
const ComboEdit = Loadable(lazy(() => import('views/Combos/Edit')));

const ComboRoute = {
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
                    path: 'combos',
                    children: [
                        { index: true, element: <ComboDefault /> },
                        { path: 'addnew', element: <ComboAddnew /> },
                        { path: 'display/:id', element: <ComboDisplay /> },
                        { path: 'edit/:id', element: <ComboEdit /> }
                    ]
                }
            ]
        }
    ]
};

export default ComboRoute;
