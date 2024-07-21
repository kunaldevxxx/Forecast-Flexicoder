import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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

  const jwtToken = localStorage.getItem('jwt'); // Get JWT token once and use it in all API requests

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
    </Grid>
      <ReactApexChart options={options} series={series} type="line" height={340} />
    </div>
  );
}
