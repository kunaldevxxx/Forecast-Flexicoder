import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Avatar, Box, Button, Grid, Typography, Card, CardContent, CardHeader, Divider
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import OrdersTable from './OrdersTable';
import ReportAreaChart from './ReportAreaChart';
import SaleReportCard from './SaleReportCard';
import UniqueVisitorCard from './UniqueVisitorCard';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

const CustomCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'visible',
  '& .MuiCardHeader-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiCardContent-root': {
    borderRadius: 12,
    padding: theme.spacing(2),
  },
}));

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

const DashboardDefault = () => {
  const theme = useTheme();
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [stockData, setStockData] = useState([]);
  const reorderThresholdPercentage = 70; // Set threshold as a percentage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const config = {
          headers: { 'Authorization': `Bearer ${token}` },
        };
        const salesResponse = await axios.get('https://forecasting-kfs8.onrender.com/sales', config);
        setSalesData(salesResponse.data.sales);

        const productsResponse = await axios.get('https://forecasting-kfs8.onrender.com/products', config);
        setProductsData(productsResponse.data.products);

        const stockResponse = await axios.get('https://forecasting-kfs8.onrender.com/stock', config);
        setStockData(stockResponse.data.products);

        const inventoryResponse = await axios.get('https://forecasting-kfs8.onrender.com/inventory', config);
        setTotalInventoryValue(inventoryResponse.data.totalInventoryValue.toFixed(2));  // Set total inventory value from API

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateTotalInventoryValue = () => {
    if (!productsData || productsData.length === 0) return '0.00';
    return productsData.reduce((acc, product) => acc + parseFloat(product.price) * product.quantity, 0).toFixed(2);
  };

  const calculateTotalStockLevel = () => {
    if (!productsData || productsData.length === 0) return 0;
    return productsData.reduce((acc, product) => acc + product.quantity, 0);
  };

  const calculateStockRiskout = () => {
    if (!productsData || productsData.length === 0) {
      console.log('No products data available.');
      return "No data";
    }

    const totalStock = calculateTotalStockLevel();
    const averageStock = totalStock / productsData.length;
    const thresholdQuantity = averageStock * (reorderThresholdPercentage / 100);
    const riskyProducts = productsData.filter(product => product.quantity < thresholdQuantity);

    // Use a Set to avoid repetitive product names
    const processedProductNames = new Set();
    const uniqueRiskyProducts = [];

    riskyProducts.forEach(product => {
      if (!processedProductNames.has(product.name)) {
        processedProductNames.add(product.name);
        uniqueRiskyProducts.push(product);
      }
    });

    // Constructing a string with names and counts
    return uniqueRiskyProducts.map(product => `${product.name}: ${product.quantity}`).join(', ');
  };

  const calculateReorderAlerts = () => {
    if (!productsData || productsData.length === 0) return 0;
    const averageStock = calculateTotalStockLevel() / productsData.length;
    const thresholdQuantity = averageStock * (reorderThresholdPercentage / 100);
    return productsData.filter(product => product.quantity < thresholdQuantity).length;
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
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
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Highlight File Upload at the Top for Immediate Access */}
      <Grid item xs={12}>
        <CustomCard>
          <CardHeader title="Quick Actions" />
          <CardContent>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                  transition: "background-color 0.3s ease-in-out",
                },
                width: '100%',
              }}
            >
              Upload CSV
              <input type="file" hidden onChange={onFileChange} />
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Quickly upload your data to see analytics
            </Typography>
          </CardContent>
        </CustomCard>
      </Grid>

      {/* Dashboard Overview */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom color={theme.palette.secondary.dark}>
          Dashboard Overview
        </Typography>
      </Grid>

      {/* Key Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <CardContent>
                <Typography variant="h6" color="textPrimary">
                  Total Inventory Value
                </Typography>
                <Typography variant="h4" color="secondary">
                  ₹{totalInventoryValue}
                </Typography>
              </CardContent>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <CardContent>
                <Typography variant="h6" color="textPrimary">
                  Stock Level
                </Typography>
                <Typography variant="h4" color="secondary">
                  {calculateTotalStockLevel()}
                </Typography>
              </CardContent>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <CardContent>
                <Typography variant="h6" color="textPrimary">
                  Stock Riskout
                </Typography>
                <Typography variant="h4" color="secondary">
                  {calculateStockRiskout()}
                </Typography>
              </CardContent>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <CardContent>
                <Typography variant="h6" color="textPrimary">
                  Reorder Alerts
                </Typography>
                <Typography variant="h4" color="secondary">
                  {calculateReorderAlerts()}
                </Typography>
              </CardContent>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>

      {/* Data Visualization Sections */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomCard>
              <CardHeader title="Top Products" />
              <CardContent>
                <OrdersTable />
              </CardContent>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard>
              <CardHeader title="Sales Report" />
              <CardContent>
                <SaleReportCard />
              </CardContent>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>

      {/* Additional Metrics and Analyses */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomCard>
              <CardHeader title="Return Risk Analysis" />
              <CardContent>
                <MonthlyBarChart salesData={salesData} />
              </CardContent>
            </CustomCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCard>
              <CardHeader title="Customer Sentiment Analysis" />
              <CardContent>
                <ReportAreaChart />
              </CardContent>
            </CustomCard>
          </Grid>
        </Grid>
      </Grid>

      {/* Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Grid>
  );
};

export default DashboardDefault;
