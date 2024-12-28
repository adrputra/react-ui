import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import InvitationPage from './pages/InvitationPage';
import UserListPage from './pages/UserListPage';
import ScanPage from './pages/ScanPage';
import PaymentPage from './pages/PaymentPage';
import SimpleLayout from './layouts/simple';
import Page404 from './pages/Page404';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { element: <Navigate to="/dashboard/app" />, index: true },
      { path: 'app', element: <DashboardAppPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'users', element: <UserListPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'invitation', element: <InvitationPage /> },
      { path: 'scanner', element: <ScanPage /> },
    ],
  },
  { path: '/payment', element: <PaymentPage /> },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <SimpleLayout />,
    children: [
      { path: '404', element: <Page404 /> },
      { path: '/*', element: <Navigate to="404" /> },
    ],
  },
  {
    path: '/*',
    element: <Navigate to="/404" replace />,
  },
]);

export default function Router() {
  return <RouterProvider router={routes} />;
}
