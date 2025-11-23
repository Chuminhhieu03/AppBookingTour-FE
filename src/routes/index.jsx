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
import BlogPostCustomerRoute from './Customers/BlogPostCustomerRoute';
import ComboRoute from './ComboRoute';
import TourRoute from './TourRoute';
import BookingRoute from './BookingRoute';
import StatisticsRoute from './StatisticsRoute';
import AssignedTourRoute from './AssignedTourRoute';

const router = createBrowserRouter(
    [
        HomeCustomerRoute,
        TourCustomerRoute,
        ComboCustomerRoute,
        AccommodationCustomerRoute,
        BlogPostCustomerRoute,
        NavigationRoutes,
        ComponentsRoutes,
        ChartMapRoutes,
        PagesRoutes,
        OtherRoutes,
        DiscountRoute,
        AccommodationRoute,
        ChangePasswordRoute,
        BlogPostRoute,
        ProfileCustomerRoute,
        ComboRoute,
        TourRoute,
        BookingRoute,
        StatisticsRoute,
        AssignedTourRoute
    ],
    {
        basename: import.meta.env.VITE_APP_BASE_NAME
    }
);

export default router;
