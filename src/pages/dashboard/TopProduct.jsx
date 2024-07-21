import React from 'react';
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';
import { Grid, Typography } from '@mui/material';

const TopProduct = () => {
  return (
    
      <Grid item xs={12} sm={4}>
          <MainCard sx={{ height: '100%', display: 'flex', mt: 2, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h5" gutterBottom>
              Top Products
            </Typography>
            <OrdersTable />
          </MainCard>
        </Grid>
  )
}

export default TopProduct;
