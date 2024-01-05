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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6">Pie Chart</Typography>
          <PieChart width={400} height={300}>
            <Pie data={dashboardData.pieChart} dataKey="count">
              {dashboardData.pieChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Paper>
      </Grid>

        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6">Bar Graph</Typography>
            <BarChart width={400} height={300} data={dashboardData.barGraph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalBookings" fill="#8884d8" />
            </BarChart>
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

