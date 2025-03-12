import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Dashboard1 from './components/Dashboard1';
import { useState } from 'react';
import { ConfigProvider, theme } from 'antd';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [userType, setUserType] = useState(null);

  const handleLogin = (credentials) => {
    if (credentials.username === "credibly" && credentials.password === "intain123") {
      setIsAuthenticated(true);
      setUserType('credibly');
      return true;
    } else if (credentials.username === "uown" && credentials.password === "intain123") {
      setIsAuthenticated(true);
      setUserType('uwon');
      return true;
    }
    return false;
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard1 setSelectedLoan={setSelectedLoan} userType={userType} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/viewdetails" 
              element={isAuthenticated ? <Dashboard selectedLoan={selectedLoan} userType={userType} /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </SnackbarProvider>
  );
}

export default App;
