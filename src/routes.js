import { Navigate, useRoutes } from 'react-router-dom';
import { useState, useEffect } from 'react';
// layouts
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

// ----------------------------------------------------------------------

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const sessionExists = getCookie('session');
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // Check if user was previously logged in
      console.log(sessionExists, isLoggedIn);
      if (sessionExists) {
        setIsLoggedIn(true);
        console.log('Setting login...');
        sessionStorage.setItem('isLoggedIn', 'true'); // Store the logged-in state in sessionStorage
      } else {
        setIsLoggedIn(isLoggedIn);
      }
  }, []);

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  console.log('State before route : ', isLoggedIn);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'invitation', element: <InvitationPage /> },
      ],
    },
    {
      path: '/',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    },
    {
      path: 'login',
      element: isLoggedIn ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
