// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { FcAddDatabase, FcBusinessman } from "react-icons/fc";



// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  FcBusinessman,
  FcAddDatabase
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.FcBusinessman,
      target: true
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.FcAddDatabase,
      target: true
    }
  ]
};

export default pages;
