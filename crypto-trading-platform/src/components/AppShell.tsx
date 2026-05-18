import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const AppShell: React.FC = () => {
  const { state } = useAuth();
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
          <Link to="/wallet">Wallet</Link>
          <Link to="/login">Wallet Login</Link>
        </nav>

        <div className="account-panel">
          {state.walletAddress ? (
            <>
              <span className="account-chip">{shortAddress}</span>
              <span className="status-tag" style={{ background: '#334155', color: '#dbeafe' }}>
                若要断开，请在钱包扩展中撤销授权
              </span>
            </>
          ) : (
            <span className="status-tag">Wallet not connected</span>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
