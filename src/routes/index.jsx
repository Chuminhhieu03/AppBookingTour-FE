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

const router = createBrowserRouter(
  [NavigationRoutes, ComponentsRoutes, FormsRoutes, TablesRoutes, ChartMapRoutes, PagesRoutes, OtherRoutes,
    DiscountRoute, AccommodationRoute
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
