import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
// third-party
import { NumericFormat } from 'react-number-format';
import axios from 'axios';

// ==============================|| API FETCH AND DATA MANAGEMENT ||============================== //

const fetchSalesData = async (token) => {
  try {
    const response = await axios.get('https://forecasting-kfs8.onrender.com/sales', {
      headers: {
        'Authorization': `Bearer ${token}` // Set the Authorization header with the JWT token
      }
    });
    // Sorting by quantitySold and picking top 5
    return response.data.sales.sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    return [];
  }
};

const fetchProductsData = async (token) => {
  try {
    const response = await axios.get('https://forecasting-kfs8.onrender.com/products', {
      headers: {
        'Authorization': `Bearer ${token}` // Set the Authorization header with the JWT token
      }
    });
    return response.data.products;
  } catch (error) {
    console.error('Failed to fetch products data:', error);
    return [];
  }
};

const fetchData = async () => {
  const token = localStorage.getItem('jwt'); // Fetch the JWT token from local storage

  if (!token) {
    console.error('No token found');
    return [];
  }

  const [salesData, productsData] = await Promise.all([fetchSalesData(token), fetchProductsData(token)]);

  // Create a mapping of product IDs to product names
  const productMap = productsData.reduce((map, product) => {
    map[product.id] = product.name;
    return map;
  }, {});

  // Map product IDs to product names in the sales data
  const salesDataWithProductNames = salesData.map(sale => ({
    ...sale,
    productName: productMap[sale.productId]
  }));

  // Combine sales data with the same product name
  const combinedSalesData = salesDataWithProductNames.reduce((acc, sale) => {
    const existingProduct = acc.find(item => item.productName === sale.productName);
    if (existingProduct) {
      existingProduct.quantitySold += sale.quantitySold;
    } else {
      acc.push(sale);
    }
    return acc;
  }, []);

  return combinedSalesData;
};

// ==============================|| ORDER TABLE - HEADER ||============================== //

const headCells = [
  { id: 'productName', align: 'left', disablePadding: true, label: 'Product Name' },
  { id: 'quantitySold', align: 'right', disablePadding: false, label: 'Quantity Sold' }
];

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData().then(setRows);
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead />
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={row.id}
              >
                <TableCell>{row.productName}</TableCell>
                <TableCell align="right">{row.quantitySold}</TableCell>
                {/* <TableCell>{new Date(row.salesDate).toLocaleDateString()}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string
};
