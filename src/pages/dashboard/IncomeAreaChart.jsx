import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

export default function IncomeAreaChart({ slot, salesData }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main],
      xaxis: {
        categories: getCategories(),
        labels: {
          style: {
            colors: Array(12).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: getTickAmount()
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
      }
    }));
  }, [secondary, line, theme, slot, salesData]);

  const getCategories = () => {
    if (slot === 'year') {
      return salesData.yearlySales?.map((item) => item.year.toString()) || [];
    } else if (slot === 'month') {
      return salesData.monthlySales?.map((item) => item.month) || [];
    } else if (slot === 'week') {
      return salesData.weeklySales?.map((item) => `Week ${item.week}`) || [];
    }
    return [];
  };

  const getTickAmount = () => {
    if (slot === 'year') return salesData.yearlySales?.length || 0;
    if (slot === 'month') return 12;
    if (slot === 'week') return salesData.weeklySales?.length || 0;
    return 0;
  };

  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (salesData) {
      let data = [];
      if (slot === 'year') {
        data = salesData.yearlySales?.map((item) => item.totalQuantitySold) || [];
      } else if (slot === 'month') {
        data = salesData.monthlySales?.map((item) => item.totalQuantitySold) || [];
      } else if (slot === 'week') {
        data = salesData.weeklySales?.map((item) => item.totalQuantitySold) || [];
      }

      setSeries([
        {
          name: 'Total Sales',
          data: data
        }
      ]);
    }
  }, [slot, salesData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = {
  slot: PropTypes.string,
  salesData: PropTypes.object
};