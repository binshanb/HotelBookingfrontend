import React,{useEffect,useState}  from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import  adminInstance  from '../../utils/Axios';

const AdminDashboard = () => {

const [dashboardData,setDashboardData]=useState(null)
const [isDashboardData,isSetDashboardData]=useState(false)


  useEffect(()=>{
    const fetchDataForDashBoard=async()=>{
     try{
   const res=await adminInstance.get('booking/admin/dashboard-data')
   console.log(res.data.responseData,'res.data.responseData')
   console.log(res.data,'res.data')
   setDashboardData(res.data)
   
     }catch(error){
   
     }
    }
    fetchDataForDashBoard()
   
   },[])

   useEffect(()=>{
    isSetDashboardData(true)
    console.log(dashboardData,'dashboardData in useEffect');
   },[dashboardData])
  // Sample data for pie chart and bar graph
  const pieChartData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 },
  ];

  const barGraphData = [
    { name: 'Data 1', value: 100 },
    { name: 'Data 2', value: 200 },
    { name: 'Data 3', value: 300 },
    { name: 'Data 4', value: 400 },
    { name: 'Data 5', value: 500 },
  ];

  const colors = ['#0088FE', '#00C49F', '#FFBB28'];

  return (

    <Container >
    {isDashboardData && dashboardData ?(
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
  <Tooltip formatter={(value, name) => [value, name]} />
</PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
  <Paper>
    <Typography variant="h6" component="h2" gutterBottom>
      Bar Graph
    </Typography>
    <BarChart width={400} height={400} data={dashboardData.data.barGraph}>
      <XAxis dataKey="_id" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="totalCustomers"
        barSize={20} // Set a specific width for each bar
        fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for all bars
      />
    </BarChart>
  </Paper>
</Grid>



        <Grid item xs={12} md={4}>
  <Paper>
    <Typography variant="h6" component="h2" gutterBottom>
    Average Booking Price
    </Typography>
    {/* Check if dashboardData is not null before accessing its properties */}
    {dashboardData && dashboardData.data && dashboardData.data.statistics && (
      
        <p> {dashboardData.data.statistics.averageBookingPrice}</p>
     
    )}
  </Paper>
</Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
            Total Amount
            </Typography>
            {dashboardData.data.barGraph.averageBookingPrice}
            {/* Add your statistics content here */}
            {dashboardData && dashboardData.data && dashboardData.data.statistics && (
      <p>{dashboardData.data.statistics.price}</p>
  )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
            Total Customers
            </Typography>
            {dashboardData && dashboardData.data && dashboardData.data.statistics && (

      <p>Total Customers{dashboardData.data.statistics.totalMembers}</p>
   
  )}
            {/* Add your statistics content here */}
          </Paper>
        </Grid>
      </Grid>
      </div>
   
    ):(

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
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
              Bar Graph
            </Typography>
            <BarChart width={400} height={400} data={barGraphData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
              Statistics 1
            </Typography>
            {/* Add your statistics content here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
              Statistics 2
            </Typography>
            {/* Add your statistics content here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper>
            <Typography variant="h6" component="h2" gutterBottom>
              Statistics 3
            </Typography>
            {/* Add your statistics content here */}
          </Paper>
        </Grid>
      </Grid>
      </div>
    )}
    </Container>
    
  );
};

export default AdminDashboard;
