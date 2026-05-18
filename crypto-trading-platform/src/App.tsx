import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './router/routes';

const AppRoutes: React.FC = () => {
  return useRoutes(routes);
};

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
