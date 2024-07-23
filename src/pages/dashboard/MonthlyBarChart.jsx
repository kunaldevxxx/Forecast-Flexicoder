import React, { useEffect, useState } from 'react';
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
      borderRadius: 10,
      horizontal: false,
      distributed: true
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, { seriesIndex, dataPointIndex, w }) {
      const item = w.config.series[seriesIndex].data[dataPointIndex];
      return `${item.y} (${item.returnRisk})`;
    },
    style: {
      colors: ['#fff'],
      fontSize: '12px',
      fontFamily: 'Helvetica, Arial, sans-serif',
    },
    background: {
      enabled: true,
      foreColor: '#000',
      padding: 4,
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
        colors: '#666',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    show: true,
    title: {
      text: 'Quantity',
      style: {
        color: '#666',
        fontSize: '16px'
      }
    },
    labels: {
      style: {
        colors: '#666',
        fontSize: '12px'
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
          text: 'Baseline',
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
  colors: [], // Set dynamically based on returnRisk
  tooltip: {
    enabled: true,
    theme: 'dark',
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const item = w.config.series[seriesIndex].data[dataPointIndex];
      return `<div style="padding: 5px; font-size: 12px;"><strong>${item.x}</strong><br>Stock: ${item.y}<br>Risk: ${item.returnRisk}</div>`;
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
      const colors = data.map(item => {
        switch(item.returnRisk) {
          case 'High': return '#FF4560'; // Red
          case 'Medium': return '#FFC107'; // Amber
          default: return '#00A9E0'; // Blue
        }
      });

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
