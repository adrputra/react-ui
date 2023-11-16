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
      path: '/ui/dashboard/app',
      icon: icon('ic_analytics'),
      level: [0, 1],
    },
    {
      title: 'user',
      path: '/ui/dashboard/user',
      icon: icon('ic_user'),
      level: [0],
    },
    {
      title: 'users',
      path: '/ui/dashboard/users',
      icon: icon('ic_user'),
      level: [0],
    },
    {
      title: 'invitation',
      path: '/ui/dashboard/invitation',
      icon: icon('ic_user'),
      level: [0, 1],
    },
    {
      title: 'product',
      path: '/ui/dashboard/products',
      icon: icon('ic_cart'),
      level: [0],
    },
    {
      title: 'blog',
      path: '/ui/dashboard/blog',
      icon: icon('ic_blog'),
      level: [0],
    },
    {
      title: 'login',
      path: '/ui/login',
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

  const filteredNavConfig = navConfig.filter((item) => item.level.includes(parseInt(metadata.levelId, 10)));
  return filteredNavConfig;
}

export default GetNavConfig; // Export the result (filtered array) directly
