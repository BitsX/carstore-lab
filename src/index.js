import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import './index.css';
import App from './App';
import {CompareProvider} from './context/CompareContext';
import reportWebVitals from './reportWebVitals';
// Điểm vào của ứng dụng: Router điều hướng, AuthProvider giữ phiên mô phỏng.
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AuthProvider><CompareProvider><App/></CompareProvider></AuthProvider></BrowserRouter>);
reportWebVitals();
