import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const Login: React.FC = () => {
  const { state, connectWallet, disconnectWallet } = useAuth();
  const navigate = useNavigate();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="page-card">
      <h2>Web3 钱包登录</h2>
      <p className="small-note">
        使用 MetaMask 或任何兼容的以太坊钱包进行登录。该项目骨架已支持钱包连接方式，便于后续企业级迭代。
      </p>

      <div className="login-panel">
        {state.walletAddress ? (
          <div className="info-card">
            <p className="field-label">已连接地址</p>
            <p className="field-value">{state.walletAddress}</p>
            <p className="field-label">网络 ID</p>
            <p className="field-value">{state.chainId ?? '未知'}</p>
            <button className="button-primary" type="button" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="login-actions">
            <button className="button-primary" type="button" onClick={handleConnect} disabled={state.loading}>
              {state.loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
            {state.error ? <p className="status-error">{state.error}</p> : null}
            <p className="small-note">
              如果您尚未安装钱包，请先安装 MetaMask 或其他 Web3 钱包扩展。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
