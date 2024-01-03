import React,{useEffect,useState}  from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { adminInstance } from '../../utils/Axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isDashboardData, setIsDashboardData] = useState(false);
  const colors = ['#0088FE', '#00C49F', '#FFBB28'];




  useEffect(() => {
    const fetchDataForDashboard = async () => {
      try {
        const res = await adminInstance.get('booking/admin/dashboard-data/');
        setDashboardData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDataForDashboard();
  }, []);

  useEffect(() => {
    setIsDashboardData(true);
  }, [dashboardData]);

  // ... (other chart data)

  return (
    <Container>
      <div className=' pl-24'>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper>
              <Typography variant="h6" component="h2" gutterBottom>
                Pie Chart
              </Typography>
              <PieChart width={400} height={400}>
                {isDashboardData && dashboardData?.data?.pieChart ? (
                  <Pie
                    data={dashboardData.data.pieChart}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {dashboardData.data.pieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                ) : (
                  // Render a fallback if the data is not available yet
                  <p>Loading...</p>
                )}
              </PieChart>
            </Paper>
          </Grid>
          {/* ... Other Grid items */}
        </Grid>
      </div>
    </Container>
  );
};

export default AdminDashboard;
