import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

const ChangePasswordPage = Loadable(lazy(() => import('views/auth/change-password/ChangePassword')));

const ChangePasswordRoute = {
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
          path: 'change-password',
          element: <ChangePasswordPage />
        }
      ]
    }
  ]
};

export default ChangePasswordRoute;
