import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Dashboard1 from './components/Dashboard1';
import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [userType, setUserType] = useState(() => {
    return sessionStorage.getItem('userType');
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = (credentials) => {
    if (credentials.username === "credibly" && credentials.password === "intain123") {
      sessionStorage.setItem('originatorName', credentials.username);
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userType', 'credibly');
      setIsAuthenticated(true);
      setUserType('credibly');
      return true;
    } else if (credentials.username === "uown" && credentials.password === "intain123") {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userType', 'uwon');
      setIsAuthenticated(true);
      setUserType('uwon');
      return true;
    }
    enqueueSnackbar('Invalid username or password', { variant: 'error' });
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
