import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const defaultBarChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    },
    background: '#f4f4f4'
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
      borderRadius: 6,
      horizontal: false,
      distributed: true,  // This will allow us to specify colors per bar
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      const dataIndex = opts.dataPointIndex;
      const returnRisk = opts.w.config.series[opts.seriesIndex].data[dataIndex].returnRisk;
      return `Return: ${returnRisk}`;
    },
    style: {
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#000',
      padding: 6,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#ddd'
    }
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#666'
      }
    }
  },
  yaxis: {
    show: true,
    title: {
      text: 'Quantity',
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        colors: '#666'
      }
    }
  },
  grid: {
    show: true,
    borderColor: '#eee',
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    }
  },
  annotations: {
    yaxis: [
      {
        y: 0,
        borderColor: '#FF4560',
        borderWidth: 1,
        label: {
          text: 'Zero Line',
          style: {
            color: '#FF4560',
            background: '#FFF',
            borderRadius: 2,
            borderWidth: 1
          }
        }
      }
    ]
  },
  colors: [], // We'll set this dynamically
  tooltip: {
    enabled: true,
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const returnRisk = w.config.series[seriesIndex].data[dataPointIndex].returnRisk;
      return `<div>Return Risk: ${returnRisk}</div>`;
    }
  }
};

export default function MonthlyBarChart() {
  const theme = useTheme();
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(defaultBarChartOptions);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.get('https://forecasting-kfs8.onrender.com/returnrisk', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const data = response.data.currentInventory;
      const categories = data.map(item => item.productName);
      const currentStockData = data.map(item => ({
        x: item.productName,
        y: item.currentStock,
        returnRisk: item.returnRisk
      }));
      const totalQuantitySoldData = data.map(item => ({
        x: item.productName,
        y: item.totalQuantitySold,
        returnRisk: item.returnRisk
      }));
      const colors = data.map(item => item.returnRisk === 'High' ? '#FF4560' : '#00A9E0');

      setOptions(prevState => ({
        ...prevState,
        xaxis: { ...prevState.xaxis, categories: categories },
        colors: colors
      }));

      setSeries([
        { name: 'Current Stock', data: currentStockData },
        { name: 'Total Quantity Sold', data: totalQuantitySoldData }
      ]);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, [theme]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
}
