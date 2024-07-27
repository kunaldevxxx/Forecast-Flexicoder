// assets
import {
  AntDesignOutlined,
  AppstoreAddOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { FcBarChart, FcFactory, FcPaid, FcSalesPerformance, FcStackOfPhotos, FcStatistics } from "react-icons/fc";
import { FcLineChart } from "react-icons/fc";

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  FcSalesPerformance,
  FcStackOfPhotos,
  FcStatistics,
 FcBarChart,
 FcFactory,
 FcPaid,FcLineChart
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Features',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Sales Forecasting  ',
      type: 'item',
      url: '/Forecast',
      icon: icons.FcSalesPerformance
    },
    {
      id: 'util-color',
      title: 'Products',
      type: 'item',
      url: '/Product',
      icon: icons.FcStackOfPhotos
    },
    {
      id: 'util-shadow',
      title: 'Top Product',
      type: 'item',
      url: '/TopProduct',
      icon: icons.FcStackOfPhotos
    },
    {
      id: 'util-report',
      title: 'Sales Report',
      type: 'item',
      url: '/UniqueVisitorCard',
      icon: icons.FcStatistics
    },
    {
      id: 'util-seasonalforecast',
      title: 'Seasonal Forecast',
      type: 'item',
      url: '/SeasonalForecast',
      icon: icons.FcLineChart
    },
    {
      id: 'util-bar',
      title: 'Return Risk Analysis',
      type: 'item',
      url: '/MonthlyBarChart',
      icon: icons.FcBarChart
    },
    {
      id: 'util-Area',
      title: 'Customer Sentiment Analysis',
      type: 'item',
      url: '/ReportArea',
      icon: icons.FcBarChart
    },
    {
      id: 'util-Target',
      title: 'Target vs Reality',
      type: 'item',
      url: '/Saleschart',
      icon: icons.FcPaid
    },
    {
      id: 'util-shadow',
      title: 'Create Sale',
      type: 'item',
      url: '/CreateSale',
      icon: icons.FcFactory
    }
  ]
};

export default utilities;
