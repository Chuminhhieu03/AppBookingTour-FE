import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import AuthLayout from 'layout/Auth';

// render - login pages
const LoginPage = Loadable(lazy(() => import('views/auth/login/Login')));

// render - register pages
const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));

// render - forgot password page
const ForgotPasswordPage = Loadable(lazy(() => import('views/auth/forgot-password/ForgotPassword')));

// render - reset password page
const ResetPasswordPage = Loadable(lazy(() => import('views/auth/reset-password/ResetPassword')));

// render - confirm email page
const ConfirmEmailPage = Loadable(lazy(() => import('views/auth/confirm-email/ConfirmEmail')));

// ==============================|| AUTH PAGES ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: 'forgot-password',
          element: <ForgotPasswordPage />
        },
        {
          path: 'reset-password',
          element: <ResetPasswordPage />
        },
        {
          path: 'confirm-email',
          element: <ConfirmEmailPage />
        }
      ]
    }
  ]
};

export default PagesRoutes;
