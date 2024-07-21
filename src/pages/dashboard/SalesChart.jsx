import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: [] // Placeholder for product names
  },
  yaxis: {
    title: {
      text: 'QTY'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `${val} `;
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

const initialSeries = [
  {
    name: 'Current Stock',
    data: [0, 0, 0, 0, 0, 0] // initial data placeholder
  },
  {
    name: 'Stock',
    data: [0, 0, 0, 0, 0, 0] // initial data placeholder
  }
];

// ==============================|| SALES COLUMN CHART ||============================== //

export default function SalesChart() {
  const theme = useTheme();
  const [legend, setLegend] = useState({
    currentStock: true,
    stock: true
  });
  const { currentStock, stock } = legend;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;
  const [series, setSeries] = useState(initialSeries);
  const [targetedSaleQty, setTargetedSaleQty] = useState(0);
  const [realitySaleQty, setRealitySaleQty] = useState(0);
  const [productNames, setProductNames] = useState([]); // New state for product names

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const fetchData = async () => {
      try {
        const stockResponse = await axios.get('https://forecasting-kfs8.onrender.com/stock', { headers });
        const salesResponse = await axios.get('https://forecasting-kfs8.onrender.com/salename', { headers });
        console.log(salesResponse.data, stockResponse.data);

        const stockData = stockResponse.data.stockByProduct;
        const salesData = salesResponse.data.salesByProduct;

        const currentStockData = stockData.map(item => item.totalQuantity);
        const stockDataSold = salesData.map(item => item.totalQuantitySold);
        const productNames = stockData.map(item => item.productName); // Extract product names

        // Calculate targeted and reality sale quantities
        const targetedSaleQuantity = stockData.reduce((acc, item) => acc + item.totalQuantity, 0);
        const realitySaleQuantity = salesData.reduce((acc, item) => acc + item.totalQuantitySold, 0);

        setTargetedSaleQty(targetedSaleQuantity);
        setRealitySaleQty(realitySaleQuantity);
        setProductNames(productNames); // Set product names

        setSeries([
          {
            name: 'Current Stock',
            data: currentStockData
          },
          {
            name: 'Stock',
            data: stockDataSold
          }
        ]);

        // Update chart options with product names as categories
        setOptions(prevState => ({
          ...prevState,
          xaxis: {
            ...prevState.xaxis,
            categories: productNames
          }
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentStock && stock) {
      setSeries(series);
    } else if (currentStock) {
      setSeries([
        {
          name: 'Current Stock',
          data: series[0].data
        }
      ]);
    } else if (stock) {
      setSeries([
        {
          name: 'Stock',
          data: series[1].data
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [currentStock, stock, series]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(currentStock && stock) && stock ? [primaryMain] : [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: Array(productNames.length).fill(secondary) // Use product names count for colors array
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark, currentStock, stock, xsDown, productNames]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Targeted Sale Quantity
            </Typography>
            <Typography variant="h4">{targetedSaleQty}</Typography>
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Reality Sale Quantity
            </Typography>
            <Typography variant="h4">{realitySaleQty}</Typography>
          </Stack>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox color="warning" checked={currentStock} onChange={handleLegendChange} name="currentStock" />}
                label="Current Stock"
              />
              <FormControlLabel control={<Checkbox checked={stock} onChange={handleLegendChange} name="stock" />} label="Stock" />
            </FormGroup>
          </FormControl>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}
