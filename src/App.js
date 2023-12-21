import './App.css';
import Layout from './components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'



function App() {
  return ( 
 
    <div className="App">

   <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
  
        
       <Layout />

     
  
    </div>
   
  );
}

export default App;





















// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import UserRouter from "./routes/UserRouter";
// import { Suspense, lazy } from "react";
// const AdminRouter = lazy(() => import("./routes/AdminRouter"));

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<UserRouter />} />


//         <Route
//           path="/admin/*"
//           element={
//             <Suspense>
//               <AdminRouter />
//             </Suspense>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
