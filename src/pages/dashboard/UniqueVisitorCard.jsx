import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

export default function UniqueVisitorCard() {
  const [slot, setSlot] = useState('week');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [productName, setProductName] = useState('');
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, [slot, year, endYear, month, productName]);

  const fetchSalesData = async () => {
    try {
      let endpoint = '';
      let params = { name: productName };

      if (slot === 'year') {
        endpoint = 'https://forecasting-kfs8.onrender.com/saleyearly';
        params = { ...params, startYear: year, endYear };
      } else if (slot === 'month') {
        endpoint = 'https://forecasting-kfs8.onrender.com/salemonthly';
        params = { ...params, year };
      } else if (slot === 'week') {
        endpoint = 'https://forecasting-kfs8.onrender.com/saleweekly';
        params = { ...params, year, month };
      }

      const token = localStorage.getItem('jwt'); // Retrieve the JWT token from localStorage

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
        },
      });
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Sales Report</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              size="small"
            />
            {slot === 'year' && (
              <>
                <TextField
                  label="Start Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  size="small"
                />
                <TextField
                  label="End Year"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  size="small"
                />
              </>
            )}
            {slot === 'month' && (
              <TextField
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                size="small"
              />
            )}
            {slot === 'week' && (
              <>
                <TextField
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  size="small"
                />
              </>
            )}
            <Button
              size="small"
              onClick={() => setSlot('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('week')}
              color={slot === 'week' ? 'primary' : 'secondary'}
              variant={slot === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('year')}
              color={slot === 'year' ? 'primary' : 'secondary'}
              variant={slot === 'year' ? 'outlined' : 'text'}
            >
              Year
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart slot={slot} salesData={salesData} />
        </Box>
      </MainCard>
    </>
  );
}
