import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Select, Typography, Form, DatePicker } from 'antd';
import ApexCharts from 'react-apexcharts';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

function Forecasting() {
  const [data, setData] = useState({
    outOfStock: [],
    demand: [],
    stock: {}
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());  // Defaulting to current date

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get('https://forecasting-kfs8.onrender.com/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProduct || !selectedDate) return;

      const token = localStorage.getItem('jwt');
      const urls = [
        `https://forecasting-kfs8.onrender.com/predict-out-of-stock/${selectedProduct}`,
        `https://forecasting-kfs8.onrender.com/products/${selectedProduct}/demand`,
        `https://forecasting-kfs8.onrender.com/products/${selectedProduct}/stock-requirement?date=${moment(selectedDate).format('DD-MM-YYYY')}`
      ];

      try {
        const responses = await Promise.all(urls.map(url =>
          axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
        ));
        setData(prevData => ({
          ...prevData,
          outOfStock: [responses[0].data],
          demand: responses[1].data.salesData,
          stock: responses[2].data
        }));
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [selectedProduct, selectedDate]);

  const chartOptionsBase = {
    chart: {
      toolbar: {
        show: true
      }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6
    },
    yaxis: {
      labels: {
        show: true
      }
    }
  };

  const chartOptionsOutOfStock = {
    ...chartOptionsBase,
    annotations: {
      xaxis: data.outOfStock.map(item => ({
        x: new Date(item.outOfStockDate).getTime(),
        borderColor: '#FF4560',
        label: {
          borderColor: '#FF4560',
          style: {
            color: '#fff',
            background: '#FF4560',
          },
          text: 'Out of Stock'
        }
      }))
    }
  };

  const chartOptionsDemand = { ...chartOptionsBase };
  const chartOptionsStock = {
    ...chartOptionsBase,
    annotations: {
      xaxis: [{
        x: new Date(data.stock.date).getTime(),
        borderColor: data.stock.stockStatus === "Sufficient" ? '#00E396' : '#FF4560',
        label: {
          borderColor: data.stock.stockStatus === "Sufficient" ? '#00E396' : '#FF4560',
          style: {
            color: '#fff',
            background: data.stock.stockStatus === "Sufficient" ? '#00E396' : '#FF4560',
          },
          text: data.stock.stockStatus
        }
      }]
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form.Item label="Product">
          <Select
            value={selectedProduct}
            onChange={value => setSelectedProduct(value)}
            style={{ width: '100%' }}
          >
            {products.map(product => (
              <Option key={product.id} value={product.id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Select Date for Stock Requirement">
          <DatePicker
            onChange={date => setSelectedDate(date)}
            style={{ width: '100%' }}
            value={selectedDate}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Title level={4}>Out of Stock Prediction</Title>
        <ApexCharts
          options={chartOptionsOutOfStock}
          series={[{ name: 'Out of Stock', data: data.outOfStock.map(item => ({ x: new Date(item.outOfStockDate).getTime(), y: 1 })) }]}
          type="line"
          height={350}
        />
      </Col>
      <Col span={24}>
        <Title level={4}>Demand Forecast</Title>
        <ApexCharts
          options={chartOptionsDemand}
          series={[{ name: 'Demand', data: data.demand.map(item => ({ x: new Date(item.salesDate).getTime(), y: item.quantitySold })) }]}
          type="line"
          height={350}
        />
      </Col>
      <Col span={24}>
        <Title level={4}>Stock Requirement Prediction</Title>
        <ApexCharts
          options={chartOptionsStock}
          series={[{ name: 'Stock Status', data: [{ x: new Date(data.stock.date).getTime(), y: data.stock.averageDailySales }] }]}
          type="line"
          height={350}
        />
      </Col>
    </Row>
  );
}

export default Forecasting;
