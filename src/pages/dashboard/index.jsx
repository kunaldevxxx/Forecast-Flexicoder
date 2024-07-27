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
import OrdersTable from './OrdersTable';
import ReportAreaChart from './ReportAreaChart';
import SaleReportCard from './SaleReportCard';
import UniqueVisitorCard from './UniqueVisitorCard';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

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
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [stockData, setStockData] = useState([]);
  const reorderThresholdPercentage = 70; // Set threshold as a percentage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
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
    <Grid container spacing={2}>
  {/* Highlight File Upload at the Top for Immediate Access */}
  <Grid item xs={12}>
  <MainCard title="Quick Actions" sx={{ p: 1 }}>
    <Button
      variant="contained"
      component="label"
      sx={{
        
        backgroundColor: "primary.main", // Use theme color
        '&:hover': {
          backgroundColor: "primary.dark", // Darken button on hover
          transition: "background-color 0.3s ease-in-out"
        }
      }}
    >
      Upload CSV
      <input type="file" hidden onChange={onFileChange} />
    </Button>
    <Typography variant="h9" gutterBottom sx={{ ml:4 }}>
      Quickly upload your data to see analytics
    </Typography>
  </MainCard>
</Grid>


  {/* Dashboard Overview */}
  <Grid item xs={12}>
    <Typography variant="h4" gutterBottom>
      Dashboard Overview
    </Typography>
  </Grid>

  {/* Key Metrics */}
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce title="Total Inventory Value" count={`₹${totalInventoryValue}`} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce title="Stock Level" count={calculateTotalStockLevel()} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce title="Stock Riskout" count={calculateStockRiskout()} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticEcommerce title="Reorder Alerts" count={calculateReorderAlerts()} />
      </Grid>
    </Grid>
  </Grid>

  {/* Data Visualization Sections */}
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MainCard title="Top Products">
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Sales Report">
          <SaleReportCard />
        </MainCard>
      </Grid>
    </Grid>
  </Grid>

  {/* Additional Metrics and Analyses */}
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MainCard>
          <Typography variant="h5">Return Risk Analysis</Typography>
          <MonthlyBarChart salesData={salesData} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          <Typography variant="h5">Customer Sentiment Analysis</Typography>
          <ReportAreaChart />
        </MainCard>
      </Grid>
    </Grid>
  </Grid>

  {/* Notifications */}
  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
</Grid>
  );
}
