import { lazy } from 'react';
import Loadable from '../../components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

const ProfilePage = Loadable(lazy(() => import('views/Customers/Profiles/ProfilePage')));

const ProfileCustomerRoutes = {
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
                    path: '/profile',
                    element: <ProfilePage />
                }
            ]
        }
    ]
};

export default ProfileCustomerRoutes;
