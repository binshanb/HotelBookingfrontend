import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {Provider}  from "react-redux";
import store from "./redux/app/store";
import { BrowserRouter } from 'react-router-dom'
import Modal from 'react-modal'; 
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
     <BrowserRouter>
    <Provider store={store}> 
    <App/>
    </Provider>
    </BrowserRouter>
    </ErrorBoundary>
    
  </React.StrictMode>
);


