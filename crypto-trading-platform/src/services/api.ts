// 中文：模拟 API，数据存在 localStorage 中，适合学习与本地测试
// EN: Mock API with localStorage persistence for learning

type Ticker = { symbol: string; price: number; change: number };
type Order = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
};

export async function fetchTickers(): Promise<Ticker[]> {
  await new Promise((res) => setTimeout(res, 400));
  const stored = localStorage.getItem('mock_tickers');
  if (stored) {
    try {
      return JSON.parse(stored) as Ticker[];
    } catch {}
  }
  const data: Ticker[] = [
    { symbol: 'BTCUSDT', price: 60000, change: 2.1 },
    { symbol: 'ETHUSDT', price: 4000, change: -1.2 },
    { symbol: 'SOLUSDT', price: 100, change: 0.5 },
  ];
  localStorage.setItem('mock_tickers', JSON.stringify(data));
  return data;
}

export async function placeOrder(order: { symbol: string; side: 'buy' | 'sell'; price: number; amount: number }): Promise<Order> {
  await new Promise((res) => setTimeout(res, 300));
  const created: Order = { id: Date.now().toString(), ...order, status: 'open', createdAt: new Date().toISOString() };
  const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
  orders.unshift(created);
  localStorage.setItem('mock_orders', JSON.stringify(orders));
  return created;
}

export async function fetchOrders(): Promise<Order[]> {
  await new Promise((res) => setTimeout(res, 200));
  return JSON.parse(localStorage.getItem('mock_orders') || '[]');
}

export async function fetchWallet() {
  await new Promise((res) => setTimeout(res, 200));
  const data = {
    BTC: 0.5,
    USDT: 20000,
    ETH: 2,
  };
  return data;
}
