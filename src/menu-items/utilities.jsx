// assets
import {
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Sales Forecasting  ',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Products',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Orders Table',
      type: 'item',
      url: '/TopProduct',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-report',
      title: 'Sales Report',
      type: 'item',
      url: '/UniqueVisitorCard',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-bar',
      title: 'Monthly Bar Chart',
      type: 'item',
      url: '/MonthlyBarChart',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-Area',
      title: 'Report Area Chart',
      type: 'item',
      url: '/ReportArea',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-Target',
      title: 'Target vs Reality',
      type: 'item',
      url: '/Saleschart',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-shadow',
      title: 'Manage Inventory',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default utilities;
