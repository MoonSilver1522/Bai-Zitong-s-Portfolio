// 中文：Trade 页面骨架，包含简单的下单表单（调用模拟 API）
// EN: Trade page with a simple order form (calls mock API)
import React, { useState } from 'react';
import { placeOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Trade: React.FC = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState<number>(60000);
  const [amount, setAmount] = useState<number>(0.001);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await placeOrder({ symbol, side, price, amount });
    setLoading(false);
    // 下单后跳转到订单页查看
    navigate('/orders');
  }

  return (
    <div>
      <h2>交易 / Trade</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>交易对 / Symbol:</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </div>
        <div>
          <label>方向 / Side:</label>
          <select value={side} onChange={(e) => setSide(e.target.value as any)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label>价格 / Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label>数量 / Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <button type="submit" disabled={loading}>{loading ? '下单中...' : '下单 / Place Order'}</button>
      </form>
    </div>
  );
};

export default Trade;
