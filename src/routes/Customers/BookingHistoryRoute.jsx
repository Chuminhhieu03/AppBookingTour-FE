import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

const BookingHistory = Loadable(lazy(() => import('views/Customers/BookingHistories/BookingHistory')));

const BookingHistoryCustomerRoutes = {
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
                    path: 'my-bookings',
                    element: <BookingHistory />
                }
            ]
        }
    ]
};

export default BookingHistoryCustomerRoutes;
