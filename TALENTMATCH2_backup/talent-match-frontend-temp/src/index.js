import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot for React 18+
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Include Bootstrap styles globally

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure 'root' is the correct ID in your HTML
root.render(
    <React.StrictMode>
        {/* Wrap the entire application in the AuthProvider */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);

// Optional: Performance reporting
reportWebVitals();
