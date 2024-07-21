import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Avatar, AvatarGroup, Box, Button, Grid, List, ListItemAvatar, ListItemButton, ListItemSecondaryAction,
  ListItemText, Stack, Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
// import OrdersTable from './OrdersTable';
// import ReportAreaChart from './ReportAreaChart';
import SaleReportCard from './SaleReportCard';
import UniqueVisitorCard from './UniqueVisitorCard';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import TopProduct from './TopProduct';
import ReportArea from './ReportArea';
import { px } from 'framer-motion';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function DashboardDefault() {
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const reorderThreshold = 10000; 

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('https://forecasting-kfs8.onrender.com/sales', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSalesData(response.data.sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('https://forecasting-kfs8.onrender.com/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setProductsData(response.data.products);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchStockData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('https://forecasting-kfs8.onrender.com/stock', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStockData(response.data.products);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchSalesData();
    fetchProductsData();
    fetchStockData();
  }, []);

  const calculateTotalInventoryValue = () => {
    if (!productsData || productsData.length === 0) return '0.00';
    return productsData.reduce((acc, product) => acc + parseFloat(product.price) * product.quantity , 0).toFixed(2);
  };
  
  const calculateTotalStockLevel = () => {
    if (!productsData || productsData.length === 0) return 0;
    return productsData.reduce((acc, product) => acc + product.quantity, 0);
  };

  const calculateStockRiskout = () => {
    if (!productsData || productsData.length === 0) return 0;
    const stockRiskoutProducts = productsData.filter(product => product.quantity < reorderThreshold);
    return stockRiskoutProducts.length;
  };

  const calculateReorderAlerts = () => {
    if (!productsData || productsData.length === 0) return 0;
    return productsData.filter(product => product.quantity < reorderThreshold).length;
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.post('https://forecasting-kfs8.onrender.com/upload-csv', formData, config);

      if (response.status === 200) {
        toast.success('File uploaded successfully!');
      } else {
        toast.error('File upload failed');
      }
    } catch (error) {
      toast.error(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Inventory Value" count={calculateTotalInventoryValue()}  />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Stock Level" count={calculateTotalStockLevel()} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Stock Riskout" count={calculateStockRiskout()}  />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Reorder Alerts" count={calculateReorderAlerts()}  />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      <Grid container spacing={2}>

        {/* Top Products Section */}
        <TopProduct></TopProduct>
        {/* Transaction History Section */}
        <Grid item xs={12} sm={4}>
          <MainCard sx={{ height: '100%', mt: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h5" gutterBottom>
              Transaction History
            </Typography>
            <List
              component="nav"
              sx={{
                px: 0,
                py: 0,
                '& .MuiListItemButton-root': {
                  py: 1.5,
                  '& .MuiAvatar-root': avatarSX,
                  '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                }
              }}
            >
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                    <GiftOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $1,430
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      78%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                    <MessageOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $302
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      8%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                    <SettingOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $682
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      16%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            </List>
          </MainCard>
        </Grid>

        {/* Help & Support Chat Section */}
        <Grid item xs={12} sm={4}>
          <MainCard sx={{ height: '100%', mt: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h5" noWrap>File Upload</Typography>
            <Typography variant="caption" color="secondary" noWrap>Typical upload within 5 min</Typography>
            <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              <Avatar alt="Remy Sharp" src={avatar1} />
              <Avatar alt="Travis Howard" src={avatar2} />
              <Avatar alt="Cindy Baker" src={avatar3} />
              <Avatar alt="Agnes Walker" src={avatar4} />
            </AvatarGroup>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} component="label">
              Upload CSV
              <input type="file" hidden onChange={onFileChange} />
            </Button>
          </MainCard>
        </Grid>
      </Grid>

      {/* ToastContainer for notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* row 2 */}
      <Grid container spacing={4} mt="8px">
        <Grid item xs={12} md={4} sx={{ mt: 2 }}>
          <UniqueVisitorCard />
        </Grid>
        <Grid item xs={12} md={4} sx={{ mt: 2 }}>
          <MonthlyBarChart></MonthlyBarChart>
        </Grid>
        <Grid item xs={12} md={4} sx={{ mt: 2 }}>
          <ReportArea></ReportArea>
        </Grid>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard sx={{ mt: 2 }} />
      </Grid>
    </Grid>
  );
}
