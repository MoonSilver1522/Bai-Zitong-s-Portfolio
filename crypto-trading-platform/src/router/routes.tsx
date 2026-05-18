import React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Dashboard from '../pages/Dashboard';
import Wallet from '../pages/Wallet';
import Login from '../pages/Login';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
