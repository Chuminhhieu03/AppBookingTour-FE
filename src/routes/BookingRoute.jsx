import Loadable from 'components/Loadable';
import { lazy } from 'react';

// Booking pages
const CustomerBooking = Loadable(lazy(() => import('views/Customers/Bookings/CustomerBooking')));
const BookingSuccess = Loadable(lazy(() => import('views/Customers/Bookings/BookingSuccess')));
const BookingFailed = Loadable(lazy(() => import('views/Customers/Bookings/BookingFailed')));

const BookingRoute = {
    path: '/',
    children: [
        {
            path: 'booking/tour/:itemId',
            element: <CustomerBooking bookingType="tour" />
        },
        {
            path: 'booking/combo/:itemId',
            element: <CustomerBooking bookingType="combo" />
        },
        {
            path: 'booking/accommodation/:itemId',
            element: <CustomerBooking bookingType="accommodation" />
        },
        {
            path: 'booking/booking-success',
            element: <BookingSuccess />
        },
        {
            path: 'booking/booking-failed',
            element: <BookingFailed />
        }
    ]
};

export default BookingRoute;
