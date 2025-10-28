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

// ==== TOUR ITINERARY COMPONENTS ====
const TourItineraryAddnew = Loadable(lazy(() => import('views/Tours/TourItineraries/Addnew')));
const TourItineraryEdit = Loadable(lazy(() => import('views/Tours/TourItineraries/Edit')));
const TourItineraryDisplay = Loadable(lazy(() => import('views/Tours/TourItineraries/Display')));

// ==== TOUR DEPARTURE COMPONENTS ====
const TourDepartureAddnew = Loadable(lazy(() => import('views/Tours/TourDepartures/Addnew')));
const TourDepartureEdit = Loadable(lazy(() => import('views/Tours/TourDepartures/Edit')));
const TourDepartureDisplay = Loadable(lazy(() => import('views/Tours/TourDepartures/Display')));

// ==== ROUTE CONFIGURATION ====
const TourRoute = {
    path: '/',
    children: [
        {
            path: 'admin',
            element: (
                // Nếu cần bảo vệ route, bật lại ProtectedRoute:
                // <ProtectedRoute>
                <AdminLayout />
                // </ProtectedRoute>
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
                                { path: 'edit/:id', element: <TourEdit /> },
                                {
                                    path: ':tourId',
                                    children: [
                                        {
                                            path: 'itinerary',
                                            children: [
                                                { path: 'addnew', element: <TourItineraryAddnew /> },
                                                { path: 'edit/:itineraryId', element: <TourItineraryEdit /> },
                                                { path: 'display/:itineraryId', element: <TourItineraryDisplay /> }
                                            ]
                                        },
                                        {
                                            path: 'departure',
                                            children: [
                                                { path: 'addnew', element: <TourDepartureAddnew /> },
                                                { path: 'edit/:departureId', element: <TourDepartureEdit /> },
                                                { path: 'display/:departureId', element: <TourDepartureDisplay /> }
                                            ]
                                        }
                                    ]
                                }
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
