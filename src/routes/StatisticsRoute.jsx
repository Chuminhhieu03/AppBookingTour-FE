import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

// ==== STATISTICS COMPONENTS ====
const ItemStatisticsByRevenue = Loadable(lazy(() => import('views/Statistics/ItemStatisticsByRevenue')));
const ItemRevenueDetail = Loadable(lazy(() => import('views/Statistics/ItemRevenueDetail')));
const ItemStatisticsByBookingCount = Loadable(lazy(() => import('views/Statistics/ItemStatisticsByBookingCount')));
const ItemBookingCountDetail = Loadable(lazy(() => import('views/Statistics/ItemBookingCountDetail')));

// ==============================|| STATISTICS ROUTES ||============================== //
const StatisticsRoute = {
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
                    path: 'statistics',
                    children: [
                        {
                            path: 'item-revenue',
                            element: <ItemStatisticsByRevenue />
                        },
                        {
                            path: 'item-revenue-detail',
                            element: <ItemRevenueDetail />
                        },
                        {
                            path: 'item-booking-count',
                            element: <ItemStatisticsByBookingCount />
                        },
                        {
                            path: 'item-booking-count-detail',
                            element: <ItemBookingCountDetail />
                        }
                    ]
                }
            ]
        }
    ]
};

export default StatisticsRoute;
