import { useEffect, useState } from 'react';
import {
  Grid, Stack, Typography
} from '@mui/material';
// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
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
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart() {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [series] = useState([
    {
      data: [80, 95, 70, 42, 65, 55, 78]
    }
  ]);

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      }
    }));
  }, [primary, info, secondary]);

  return (<>

    
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Return Risk Analysis</Typography>
        </Grid>
        <Grid item />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Stack spacing={2}>
            <Typography variant="h6" color="text.secondary">
              This Week Return Value
            </Typography>
            <Typography variant="h3">$765</Typography>
          </Stack>
        </Box>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={365} />
        </Box>
      </MainCard>

  </>
  );
}
