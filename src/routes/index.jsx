import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import DiscountRoute from './DiscountRoute';
import AccommodationRoute from './AccommodationRoute';
import ChangePasswordRoute from './ChangePasswordRoute';
import BlogPostRoute from './BlogPostRoute';
import HomeCustomerRoute from './Customers/HomeCustomerRoute';
import ComboCustomerRoute from './Customers/ComboCustomerRoute';
import TourCustomerRoute from './Customers/TourCustomerRoutes';
import AccommodationCustomerRoute from './Customers/AccommodationCustomerRoutes';
import ProfileCustomerRoute from './Customers/ProfileCustomerRoute';
import ComboRoute from './ComboRoute';
import TourRoute from './TourRoute';
import BookingRoute from './BookingRoute';
import StatisticsRoute from './StatisticsRoute';
import AssignedTourRoute from './AssignedTourRoute';
import BookingHistoryCustomerRoute from './Customers/BookingHistoryRoute';

const router = createBrowserRouter(
    [
        HomeCustomerRoute,
        ComboCustomerRoute,
        NavigationRoutes,
        ComponentsRoutes,
        ChartMapRoutes,
        PagesRoutes,
        OtherRoutes,
        DiscountRoute,
        AccommodationRoute,
        ChangePasswordRoute,
        BlogPostRoute,
        TourCustomerRoute,
        ComboCustomerRoute,
        AccommodationCustomerRoute,
        ProfileCustomerRoute,
        ComboRoute,
        TourRoute,
        BookingRoute,
        StatisticsRoute,
        AssignedTourRoute,
        BookingHistoryCustomerRoute
    ],
    {
        basename: import.meta.env.VITE_APP_BASE_NAME
    }
);

export default router;
