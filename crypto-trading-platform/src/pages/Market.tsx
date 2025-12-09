// 中文：Market 页面，显示行情列表并可选择交易对
// EN: Market page listing tickers and selecting a symbol
import React, { useEffect, useState } from 'react';
import { fetchTickers } from '../services/api';

const Market: React.FC = () => {
  const [tickers, setTickers] = useState<{ symbol: string; price: number; change: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTickers().then((data) => {
      setTickers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2>行情 / Market</h2>
      {loading ? (
        <div>加载中... / Loading...</div>
      ) : (
        <ul>
          {tickers.map((t) => (
            <li key={t.symbol}>
              {t.symbol} - ${t.price} ({t.change}%)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Market;
