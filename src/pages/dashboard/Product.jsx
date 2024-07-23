import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, Select, MenuItem } from '@mui/material';
import axios from 'axios';

// Function to fetch sales data
const fetchSalesData = async (token) => {
  const url = 'https://forecasting-kfs8.onrender.com/sales';
  return axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(response => response.data.sales);
};

// Function to fetch product data
const fetchProductsData = async (token) => {
  const url = 'https://forecasting-kfs8.onrender.com/products';
  return axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(response => response.data.products);
};

// Main data fetching function with sorting logic
const fetchData = async (sortType) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    console.error('No token found');
    return [];
  }

  const [salesData, productsData] = await Promise.all([
    fetchSalesData(token),
    fetchProductsData(token)
  ]);

  // Map product IDs to product names
  const productMap = productsData.reduce((map, product) => {
    map[product.id] = product.name;
    return map;
  }, {});

  // Join sales data with product names
  const salesDataWithNames = salesData.map(sale => ({
    ...sale,
    productName: productMap[sale.productId] || 'Unknown Product'
  }));

  // Sort and filter data
  switch (sortType) {
    case 'top':
      return salesDataWithNames.sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 10);
    case 'worst':
      return salesDataWithNames.sort((a, b) => a.quantitySold - b.quantitySold).slice(0, 10);
    case 'alphabetical':
      return salesDataWithNames.sort((a, b) => a.productName.localeCompare(b.productName));
    default:
      return salesDataWithNames.slice(0, 10);
  }
};

function Products() {
  const [rows, setRows] = useState([]);
  const [sortType, setSortType] = useState('top');

  useEffect(() => {
    fetchData(sortType).then(setRows);
  }, [sortType]);

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={sortType}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="top">Top 10 Sold</MenuItem>
          <MenuItem value="worst">Worst 10 Sold</MenuItem>
          <MenuItem value="alphabetical">Sort Alphabetically</MenuItem>
        </Select>
      </FormControl>
      <TableContainer sx={{ maxHeight: 440, overflow: 'auto' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity Sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell component="th" scope="row">
                  {row.productName}
                </TableCell>
                <TableCell align="right">{row.quantitySold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

Products.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string
};

export default Products;
