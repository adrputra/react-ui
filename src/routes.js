import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// layouts
import Cookies from 'js-cookie';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import InvitationPage from './pages/InvitationPage';
import UserListPage from './pages/UserListPage';
import ScanPage from './pages/ScanPage';
import { GetMetadata } from './utils/Enigma';
import PaymentPage from './pages/PaymentPage';

const { REACT_APP_JWT_SECRET, REACT_APP_ENCRYPTION_SECRET } = process.env;
// ----------------------------------------------------------------------

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const sessionExists = Cookies.get('session', { raw: true });
    if (sessionExists) {
      setIsLoggedIn(true);
      (async () => {
        try {
          const { decryptedRes } = await GetMetadata(sessionExists, REACT_APP_JWT_SECRET, REACT_APP_ENCRYPTION_SECRET);
          sessionStorage.setItem('metadata', JSON.stringify(decryptedRes));
        } catch (error) {
          console.error('Error getting and storing metadata:', error);
        }
      })();
    } else {
      setIsLoggedIn(false);
      sessionStorage.setItem('isLoggedIn', false); // Store the logged-in state in sessionStorage
    }
  }, []);

  // const currentLocation = "/dashboard/products";
  let currentLocation;
  if (isLoggedIn) {
    if (location.pathname !== '/login') {
      localStorage.setItem('currentLocation', location.pathname);
    }
    currentLocation = localStorage.getItem('currentLocation') || '/dashboard/app';
  }

  console.log('State before route : ', isLoggedIn);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
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
      element: isLoggedIn ? <Navigate to={currentLocation} /> : <LoginPage />,
    },
    {
      path: '',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '/*', element: <Navigate to="404" /> },
      ],
    },
    {
      path: '/*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
