import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import DiscountRoute from './DiscountRoute';
import AccommodationRoute from './AccommodationRoute';
import ChangePasswordRoute from './ChangePasswordRoute';
import BlogPostRoute from './BlogPostRoute';
import AccommodationCustomerRoutes from './Customers/AccommodationCustomerRoute';
import HomeCustomerRoute from './Customers/HomeCustomerRoute';
import ComboRoute from './ComboRoute';
import TourRoute from './TourRoute';
import BookingRoute from './BookingRoute';
import StatisticsRoute from './StatisticsRoute';

const router = createBrowserRouter(
    [
        HomeCustomerRoute,
        NavigationRoutes,
        ComponentsRoutes,
        FormsRoutes,
        TablesRoutes,
        ChartMapRoutes,
        PagesRoutes,
        OtherRoutes,
        DiscountRoute,
        AccommodationRoute,
        ChangePasswordRoute,
        BlogPostRoute,
        AccommodationCustomerRoutes,
        ComboRoute,
        TourRoute,
        BookingRoute,
        StatisticsRoute
    ],
    {
        basename: import.meta.env.VITE_APP_BASE_NAME
    }
);

export default router;
