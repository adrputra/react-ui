import { Navigate, useRoutes, useLocation } from 'react-router-dom';
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
import { GetMetadata } from './utils/Enigma'

const { REACT_APP_JWT_SECRET, REACT_APP_ENCRYPTION_SECRET } = process.env;
// ----------------------------------------------------------------------

const getCookie = (name) => {
  const cookieValue = document.cookie.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`));

  if (cookieValue) {
    return cookieValue.substring(name.length + 1);
  } 
    return null;
  
};

const clearCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
      const sessionExists = getCookie('session');
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // Check if user was previously logged in
      console.log('Inside Use Effect ', sessionExists, isLoggedIn);
      if (sessionExists) {
        setIsLoggedIn(true);
        console.log('Setting login...');
        sessionStorage.setItem('isLoggedIn', true); // Store the logged-in state in sessionStorage
        const { decryptedRes } = GetMetadata(sessionExists, REACT_APP_JWT_SECRET, REACT_APP_ENCRYPTION_SECRET)
        sessionStorage.setItem('metadata', JSON.stringify(decryptedRes))
      } else {
        setIsLoggedIn(false);
        sessionStorage.setItem('isLoggedIn', false); // Store the logged-in state in sessionStorage
      }
  }, []);

  // const currentLocation = "/dashboard/products";
  let currentLocation;
  console.log(location.pathname)
  if (isLoggedIn){
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
      element: isLoggedIn ? <Navigate to={currentLocation} /> : <LoginPage />,
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
