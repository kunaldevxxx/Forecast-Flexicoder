import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import { Button } from 'antd';
// import 'antd/dist/antd.css';

const SeasonalForecasting = () => {
    const { CSVReader } = useCSVReader();
    const [csvData, setCsvData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const apiURL = 'https://forecasting-kfs8.onrender.com/forecast-data';

    const handleOnFileLoad = async (data) => {
        setCsvData(data);

        const jwtToken = localStorage.getItem('jwt');
        try {
            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setForecastData(response.data);
            prepareChartData(response.data);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }
    };

    const prepareChartData = (data) => {
        const dates = data.map(item => item['Forecast Date']);
        const forecastedProfit = data.map(item => parseFloat(item['Forecasted Total Profit']));
        const forecastedUnits = data.map(item => parseFloat(item['Forecasted Units Sold']));

        setChartOptions({
            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    }
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                }
            },
            xaxis: {
                categories: dates,
                labels: {
                    style: {
                        colors: '#333',
                        fontSize: '12px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500
                    }
                }
            },
            title: {
                text: 'Forecast Data',
                align: 'center',
                style: {
                    color: '#333',
                    fontSize: '20px',
                    fontFamily: 'Roboto, sans-serif'
                }
            },
            tooltip: {
                enabled: true,
                theme: 'dark',
            },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'center',
                labels: {
                    colors: '#333',
                    useSeriesColors: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            markers: {
                size: 5,
                colors: ['#FFA41B', '#00E396'],
                strokeColors: '#fff',
                strokeWidth: 2,
                hover: {
                    size: 7
                }
            }
        });

        setChartSeries([
            {
                name: 'Forecasted Total Profit',
                data: forecastedProfit
            },
            {
                name: 'Forecasted Units Sold',
                data: forecastedUnits
            }
        ]);
    };

    return (
        <div style={{ fontFamily: 'Roboto, sans-serif', margin: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Upload CSV and Display Forecast</h1>
            <CSVReader
                onUploadAccepted={(results) => {
                    handleOnFileLoad(results.data);
                }}
            >
                {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
                    <>
                        <div {...getRootProps()} style={{
                            border: '1px solid #333', 
                            padding: '20px', 
                            width: '300px', 
                            margin: '0 auto', 
                            textAlign: 'center', 
                            cursor: 'pointer',
                            borderRadius: '8px',
                            color: '#555'
                        }}>
                            {acceptedFile ? acceptedFile.name : 'Click to upload CSV file'}
                        </div>
                        <ProgressBar />
                        {acceptedFile && (
                            <Button {...getRemoveFileProps()} type="primary" danger style={{ 
                                display: 'block', 
                                margin: '10px auto', 
                                fontFamily: 'Roboto, sans-serif'
                            }}>
                                Remove
                            </Button>
                        )}
                    </>
                )}
            </CSVReader>
            <div style={{ marginTop: '20px' }}>
                <ApexCharts options={chartOptions} series={chartSeries} type="line" height={350} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CSVLink
                    data={csvData}
                    filename={"forecast-data.csv"}
                    className="btn btn-primary"
                    target="_blank"
                    style={{
                        display: 'inline-block',
                        // backgroundColor: '#0275d8',
                        border:'1px solid #333',
                        color: 'black',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontFamily: 'Roboto, sans-serif'
                    }}
                >
                    Download CSV
                </CSVLink>
            </div>
        </div>
    );
};

export default SeasonalForecasting;