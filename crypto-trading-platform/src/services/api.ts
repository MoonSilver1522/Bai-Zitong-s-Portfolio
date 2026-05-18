/*
  重构说明（企业级改进点）
  - 增加 `isMock` 开关，支持通过 Vite 环境变量在 mock 与真实 API 之间切换，便于开发/测试/生产环境切换。
  - 提供统一的 `request` 封装，统一处理超时、HTTP 错误、JSON 解析错误，便于添加日志/埋点/重试策略。
  - 保留原有的 localStorage mock 实现，但将其封装为独立函数，便于测试与维护。
  - 增加严格的类型签名，并在关键位置添加注释解释为何这样设计（提高可维护性与团队共识）。
*/

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

// 通过 Vite 环境变量控制是否使用 mock 实现（在 .env.development 中可设置 VITE_USE_MOCK=true）
const isMock = typeof (import.meta as any)?.env !== 'undefined' && !!((import.meta as any).env?.VITE_USE_MOCK === 'true' || (import.meta as any).env?.VITE_USE_MOCK === true);

// 统一的 fetch 封装：增加超时与错误处理，便于在企业级应用中插入监控/重试/认证拦截器
async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 10000): Promise<T> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(base + path, { ...options, signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      // 统一抛出带有 HTTP 码的信息，调用方可决定如何处理（展示错误、重试、上报）
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${text}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    // 若不是 JSON，则直接返回文本（有时后端会返回纯文本错误）
    return (await res.text()) as unknown as T;
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  }
}

// ----------------
// Mock 实现（保留原逻辑）
// ----------------
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function mockFetchTickers(): Promise<Ticker[]> {
  await delay(400);
  const stored = localStorage.getItem('mock_tickers');
  if (stored) {
    try {
      return JSON.parse(stored) as Ticker[];
    } catch (error) {
      // 解析失败后清理并继续创建默认数据，避免无限异常
      console.error('Failed to parse stored tickers', error);
      localStorage.removeItem('mock_tickers');
    }
  }
  const data: Ticker[] = [
    { symbol: 'BTCUSDT', price: 60000, change: 2.1 },
    { symbol: 'ETHUSDT', price: 4000, change: -1.2 },
    { symbol: 'SOLUSDT', price: 100, change: 0.5 },
  ];
  localStorage.setItem('mock_tickers', JSON.stringify(data));
  return data;
}

async function mockPlaceOrder(order: { symbol: string; side: 'buy' | 'sell'; price: number; amount: number }): Promise<Order> {
  await delay(300);
  const created: Order = { id: Date.now().toString(), ...order, status: 'open', createdAt: new Date().toISOString() };
  const orders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
  orders.unshift(created);
  localStorage.setItem('mock_orders', JSON.stringify(orders));
  return created;
}

async function mockFetchOrders(): Promise<Order[]> {
  await delay(200);
  return JSON.parse(localStorage.getItem('mock_orders') || '[]');
}

async function mockFetchWallet() {
  await delay(200);
  const data = {
    BTC: 0.5,
    USDT: 20000,
    ETH: 2,
  };
  return data;
}

// ----------------
// 对外接口：根据 isMock 切换到 mock 或真实实现
// 真实实现示例：使用 `/api` 前缀调用后端（`VITE_API_BASE_URL` 可在环境变量中配置）
// ----------------
export async function fetchTickers(): Promise<Ticker[]> {
  if (isMock) return mockFetchTickers();
  return request<Ticker[]>('/tickers');
}

export async function placeOrder(order: { symbol: string; side: 'buy' | 'sell'; price: number; amount: number }): Promise<Order> {
  if (isMock) return mockPlaceOrder(order);
  return request<Order>('/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
}

export async function fetchOrders(): Promise<Order[]> {
  if (isMock) return mockFetchOrders();
  return request<Order[]>('/orders');
}

export async function fetchWallet() {
  if (isMock) return mockFetchWallet();
  return request<Record<string, number>>('/wallet');
}
