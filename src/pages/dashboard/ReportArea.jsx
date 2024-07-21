import React from 'react';
import { Grid , Typography} from '@mui/material';
import MainCard from 'components/MainCard';
import ReportAreaChart from './ReportAreaChart';

const ReportArea = () => {
  return (
    <div>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Customer Sentiment Analysis</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <ReportAreaChart />
          </MainCard>
    </div>
  )
}

export default ReportArea;
