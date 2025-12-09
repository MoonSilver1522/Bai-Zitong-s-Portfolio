// 中文：Wallet 页面（显示简单的模拟资产）
// EN: Wallet page showing simple mock balances
import React, { useEffect, useState } from 'react';
import { fetchWallet } from '../services/api';

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    fetchWallet().then((w) => setWallet(w));
  }, []);

  if (!wallet) return <div>加载资产中... / Loading wallet...</div>;

  return (
    <div>
      <h2>资产 / Wallet</h2>
      <ul>
        {Object.keys(wallet).map((k) => (
          <li key={k}>
            {k}: {wallet[k]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wallet;
