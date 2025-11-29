import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

// ==== TOUR CRUD COMPONENTS ====
const TourDefault = Loadable(lazy(() => import('views/Tours/Default')));
const TourAddNew = Loadable(lazy(() => import('views/Tours/Addnew')));
const TourDisplay = Loadable(lazy(() => import('views/Tours/Display')));
const TourEdit = Loadable(lazy(() => import('views/Tours/Edit')));

// ==== TOUR CATEGORY COMPONENTS ====
const TourCategoryDefault = Loadable(lazy(() => import('views/Tours/TourCategories/Default')));
const TourCategoryAddnew = Loadable(lazy(() => import('views/Tours/TourCategories/Addnew')));
const TourCategoryEdit = Loadable(lazy(() => import('views/Tours/TourCategories/Edit')));
const TourCategoryDisplay = Loadable(lazy(() => import('views/Tours/TourCategories/Display')));

// ==== TOUR TYPE COMPONENTS ====
const TourTypeDefault = Loadable(lazy(() => import('views/Tours/TourTypes/Default')));
const TourTypeAddnew = Loadable(lazy(() => import('views/Tours/TourTypes/Addnew')));
const TourTypeEdit = Loadable(lazy(() => import('views/Tours/TourTypes/Edit')));
const TourTypeDisplay = Loadable(lazy(() => import('views/Tours/TourTypes/Display')));

// ==== ROUTE CONFIGURATION ====
const TourRoute = {
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
                    path: 'service',
                    children: [
                        {
                            path: 'tour',
                            children: [
                                { index: true, element: <TourDefault /> },
                                { path: 'addnew', element: <TourAddNew /> },
                                { path: 'display/:id', element: <TourDisplay /> },
                                { path: 'edit/:id', element: <TourEdit /> }
                            ]
                        },
                        {
                            path: 'tour-category',
                            children: [
                                { index: true, element: <TourCategoryDefault /> },
                                { path: 'addnew', element: <TourCategoryAddnew /> },
                                { path: 'display/:id', element: <TourCategoryDisplay /> },
                                { path: 'edit/:id', element: <TourCategoryEdit /> }
                            ]
                        },
                        {
                            path: 'tour-type',
                            children: [
                                { index: true, element: <TourTypeDefault /> },
                                { path: 'addnew', element: <TourTypeAddnew /> },
                                { path: 'display/:id', element: <TourTypeDisplay /> },
                                { path: 'edit/:id', element: <TourTypeEdit /> }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default TourRoute;
