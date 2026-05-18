import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const AppShell: React.FC = () => {
  const { state, disconnectWallet } = useAuth();
  const shortAddress = state.walletAddress
    ? `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
    : null;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <h1>Zitong Bai's Dashboard</h1>
          <p>企业级 Web3 仪表盘骨架</p>
        </div>

        <nav className="app-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/login">Wallet Login</Link>
        </nav>

        <div className="account-panel">
          {state.walletAddress ? (
            <>
              <span className="account-chip">{shortAddress}</span>
              <button className="ghost-button" type="button" onClick={disconnectWallet}>
                Disconnect
              </button>
            </>
          ) : (
            <span className="status-tag">Wallet not connected</span>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
