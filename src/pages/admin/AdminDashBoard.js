import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is used for HTTP requests
import {
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { adminInstance } from '../../utils/Axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    pieChart: [],
    barGraph: [],
    statistics: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminInstance.get('booking/admin/dashboard-data/');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const getFillColor = (value) => {
    // Define your logic here to assign colors based on value ranges or conditions
    if (value > 10) {
      return '#ff0000'; // Red color if value is greater than 50
    } else {
      return '#8884d8'; // Default color for other values
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
          <Typography variant="h6">Pie Chart</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dashboardData.pieChart}
            dataKey="count" // Replace with the appropriate data key from your API response
            nameKey="room__category__category_name" // Replace with the appropriate key representing the name/id in your data
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {dashboardData.pieChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      </Paper>
      </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
          <Typography variant="h6">Bar Graph</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dashboardData.barGraph}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis  dataKey="room__title" />
             
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalBookings" fill={getFillColor} />
            
        </BarChart>
      </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h6">Statistics</Typography>
            <ul>
              {Object.entries(dashboardData.statistics).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

