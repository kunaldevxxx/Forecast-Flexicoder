// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import { FcComments, FcSettings } from "react-icons/fc";

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  FcSettings,
  FcComments
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Settings',
      type: 'item',
      url: '/sample-page',
      icon: icons.FcSettings
    },
    {
      id: 'documentation',
      title: 'Message',
      type: 'item',
      url: '#',
      icon: icons.FcComments,
      external: true,
      target: true
    }
  ]
};

export default support;
