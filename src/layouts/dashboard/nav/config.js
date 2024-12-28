import { useContext } from 'react';
import SvgColor from '../../../components/svg-color';
import { MetadataContext } from '../../../hooks/MetadataContext';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

function GetNavConfig() {
  const { metadata } = useContext(MetadataContext);
  const navConfig = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_analytics'),
      level: [0, 1],
    },
    {
      title: 'user',
      path: '/dashboard/user',
      icon: icon('ic_user'),
      level: [0],
    },
    {
      title: 'users',
      path: '/dashboard/users',
      icon: icon('ic_user'),
      level: [0],
    },
    {
      title: 'invitation',
      path: '/dashboard/invitation',
      icon: icon('ic_user'),
      level: [0, 1],
    },
    {
      title: 'scanner',
      path: '/dashboard/scanner',
      icon: icon('ic_user'),
      level: [0, 1],
    },
    {
      title: 'product',
      path: '/dashboard/products',
      icon: icon('ic_cart'),
      level: [0],
    },
    {
      title: 'blog',
      path: '/dashboard/blog',
      icon: icon('ic_blog'),
      level: [0],
    },
    {
      title: 'login',
      path: '/login',
      icon: icon('ic_lock'),
      level: [0],
    },
    {
      title: 'Not found',
      path: '/404',
      icon: icon('ic_disabled'),
      level: [0],
    },
  ];

  const filteredNavConfig = navConfig.filter((item) => item.level.includes(parseInt(metadata.level_id, 10)));
  return filteredNavConfig;
}

export default GetNavConfig; // Export the result (filtered array) directly
