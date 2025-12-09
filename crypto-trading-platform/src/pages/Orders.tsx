// 中文：Orders 页面，显示本地保存的订单列表
// EN: Orders page showing locally saved order list
import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders().then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h2>订单 / Orders</h2>
      {orders.length === 0 ? (
        <div>暂无订单 / No orders yet</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.symbol}</td>
                <td>{o.side}</td>
                <td>{o.price}</td>
                <td>{o.amount}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
