import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Grid, Typography } from '@mui/material';

function CreateSale() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [salesDate, setSalesDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://forecasting-kfs8.onrender.com/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');
    setLoading(true);
    try {
      await axios.post('https://forecasting-kfs8.onrender.com/sale', {
        productId: selectedProduct,
        quantitySold,
        sellingPrice,
        salesDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sale created successfully!');
    } catch (error) {
      console.error('Failed to create sale', error);
      alert('Failed to create sale');
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={2} style={{ padding: 20 }}>
      <Typography variant="h4">Create a Sale</Typography>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Product</InputLabel>
          <Select
            value={selectedProduct}
            label="Product"
            onChange={handleProductChange}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quantity Sold"
          type="number"
          fullWidth
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Selling Price"
          type="number"
          fullWidth
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Sales Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={salesDate}
          onChange={(e) => setSalesDate(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          Create Sale
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateSale;
