import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Grid, FormControl, InputLabel, Select, MenuItem, Badge } from '@mui/material';

// chart options
const areaChartOptions = {
  chart: {
    height: 340,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 1.5
  },
  grid: {
    strokeDashArray: 4
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'MMM'
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    x: {
      format: 'MM'
    }
  }
};

export default function ReportAreaChart() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [years, setYears] = useState([...Array(new Date().getFullYear() - 2013).keys()].map(x => x + 2014));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(areaChartOptions);
  const [sentimentData, setSentimentData] = useState([]);

  const jwtToken = localStorage.getItem('jwt');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://forecasting-kfs8.onrender.com/products', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      setProducts(response.data.products);
      setSelectedProduct(response.data.products[0].name);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`https://forecasting-kfs8.onrender.com/salemonthly?name=${encodeURIComponent(selectedProduct)}&year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      const salesData = response.data.monthlySales.map(sale => ({
        x: sale.month,
        y: sale.totalQuantitySold
      }));
      setSeries([{ name: 'Sales', data: salesData }]);
      
      // Simulate sentiment data based on sales fluctuations
      const sentimentScores = salesData.map(sale => ({
        x: sale.x,
        y: (sale.y > 1000 ? 0.8 : 0.2) // Example condition
      }));
      setSentimentData(sentimentScores);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedYear) {
      fetchSalesData();
    }
  }, [selectedProduct, selectedYear]);

  return (
    <div>
      <Grid container spacing={2} marginTop={2} direction="column">
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              value={selectedProduct}
              label="Product"
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.name}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <ReactApexChart options={options} series={series} type="line" height={340} />
        </Grid>
        <Grid item xs={12}>
          {sentimentData.map((data, index) => (
            <Badge key={index} badgeContent={`${(data.y * 100).toFixed(0)}%`} color={data.y > 0.5 ? "primary" : "secondary"}>
              {data.x}
            </Badge>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
