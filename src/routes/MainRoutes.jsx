import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SalesChart = Loadable(lazy(() => import('pages/dashboard/SalesChart')));
const UniqueVisitorCard = Loadable(lazy(() => import('pages/dashboard/UniqueVisitorCard')));
const MonthlyBarChart = Loadable(lazy(() => import('pages/dashboard/MonthlyBarChart')));
const ReportArea = Loadable(lazy(() => import('pages/dashboard/ReportArea')));
const TopProduct = Loadable(lazy(() => import('pages/dashboard/TopProduct')));


// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    // {
    //   path: 'color',
    //   element: <Color />
    // },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/SalesChart',
      element: <SalesChart />
    },
    {
      path: '/UniqueVisitorCard',
      element: <UniqueVisitorCard />
    },
    {
      path: '/MonthlyBarChart',
      element: <MonthlyBarChart />
    },
    {
      path: '/ReportArea',
      element: <ReportArea />
    },
    {
      path: '/TopProduct',
      element: <TopProduct />
    }
    // {
    //   path: 'shadow',
    //   element: <Shadow />
    // },
    // {
    //   path: 'typography',
    //   element: <Typography />
    // }
  ]
};

export default MainRoutes;
