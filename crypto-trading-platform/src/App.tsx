// 中文：应用入口，配置路由并使用 AuthProvider（简单示例）所包裹
// EN: App entry, set up routing and wrap with AuthProvider (simple example)
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Trade from './pages/Trade';
import Orders from './pages/Orders';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <header className="app-header">
            <h1>加密交易平台 - Demo</h1>
            <nav>
              <Link to="/">仪表盘</Link>
              {' | '}
              <Link to="/market">行情</Link>
              {' | '}
              <Link to="/trade">交易</Link>
              {' | '}
              <Link to="/orders">订单</Link>
              {' | '}
              <Link to="/wallet"></Link>
              {' | '}
              <Link to="/settings">设置</Link>
              {' | '}
              <Link to="/login">登录</Link>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/market" element={<Market />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
