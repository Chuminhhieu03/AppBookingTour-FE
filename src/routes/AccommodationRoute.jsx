import { lazy } from 'react';
import Loadable from 'components/Loadable';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

const AccommodationDefault = Loadable(lazy(() => import('views/Accommodations/Default')));
const AccommodationAddNew = Loadable(lazy(() => import('views/Accommodations/Addnew')));
const AccommodationDisplay = Loadable(lazy(() => import('views/Accommodations/Display')));
const AccommodationEdit = Loadable(lazy(() => import('views/Accommodations/Edit')));

const AccommodationRoute = {
    path: '/',
    children: [
        {
            path: 'admin',
            element: <AdminLayout />,
            children: [
                {
                    path: 'service',
                    children: [
                        {
                            path: 'accommodation',
                            children: [
                                {
                                    index: true,
                                    element: <AccommodationDefault />
                                },
                                {
                                    path: 'addnew',
                                    element: <AccommodationAddNew />
                                },
                                {
                                    path: 'display/:id',
                                    element: <AccommodationDisplay />
                                },
                                {
                                    path: 'edit/:id',
                                    element: <AccommodationEdit />
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default AccommodationRoute;
