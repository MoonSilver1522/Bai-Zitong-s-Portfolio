import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/useAuth';

function formatEth(wei: bigint, digits = 6) {
  const base = 10n ** 18n;
  const integer = wei / base;
  const fraction = wei % base;
  const fractionText = fraction.toString().padStart(18, '0').slice(0, digits);
  return `${integer.toString()}.${fractionText}`;
}

const Wallet: React.FC = () => {
  const { state } = useAuth();
  const { walletAddress, chainId } = state;
  const [ethBalanceWei, setEthBalanceWei] = useState<bigint | null>(null);
  const [priceUsd, setPriceUsd] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setEthBalanceWei(null);
      setPriceUsd(null);
      setChange24h(null);
      setError(null);
      return;
    }

    const fetchWalletState = async () => {
      const provider = window.ethereum;
      if (!provider?.request) {
        setError('无法访问钱包提供者，请确认已安装并授权 MetaMask。');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const balanceHex = (await provider.request({
          method: 'eth_getBalance',
          params: [walletAddress, 'latest'],
        })) as string;
        const balanceWei = BigInt(balanceHex);
        setEthBalanceWei(balanceWei);

        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true',
        );
        const json = await response.json();
        const ethereum = json?.ethereum;
        if (ethereum) {
          setPriceUsd(Number(ethereum.usd ?? 0));
          setChange24h(Number(ethereum.usd_24h_change ?? 0));
        }
      } catch (err) {
        setError('获取链上资产数据失败，请稍后重试。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletState();
  }, [walletAddress]);

  const ethBalance = useMemo(() => {
    if (!ethBalanceWei) return '0.000000';
    return formatEth(ethBalanceWei, 6);
  }, [ethBalanceWei]);

  const totalValue = useMemo(() => {
    if (priceUsd == null) return 0;
    return Number(ethBalance) * priceUsd;
  }, [ethBalance, priceUsd]);

  return (
    <div className="page-card">
      <div className="dashboard-header">
        <h2>钱包资产详情</h2>
        <p>当前页面读取链上 ETH 余额与实时 USD 估值。</p>
      </div>

      {!walletAddress ? (
        <div className="info-card">
          <p className="field-label">钱包未连接</p>
          <p className="small-note">请先在登录页面连接您的 Web3 钱包，然后刷新本页查看真实资产信息。</p>
        </div>
      ) : (
        <>
          <div className="wallet-summary">
            <div className="info-card">
              <p className="field-label">地址</p>
              <p className="field-value">{walletAddress}</p>
            </div>
            <div className="info-card">
              <p className="field-label">网络 ID</p>
              <p className="field-value">{chainId ?? '未知'}</p>
            </div>
            <div className="info-card">
              <p className="field-label">ETH 余额</p>
              <p className="field-value">{ethBalance} ETH</p>
            </div>
            <div className="info-card">
              <p className="field-label">总估值</p>
              <p className="field-value">${totalValue.toFixed(2)}</p>
            </div>
          </div>

          {loading ? (
            <div className="info-card">
              <p className="field-label">正在更新资产信息...</p>
            </div>
          ) : error ? (
            <div className="info-card">
              <p className="field-label">数据获取失败</p>
              <p className="small-note">{error}</p>
            </div>
          ) : (
            <table className="asset-table">
              <thead>
                <tr>
                  <th>资产</th>
                  <th>余额</th>
                  <th>当前价格</th>
                  <th>24h 变化</th>
                  <th>当前价值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ETH</td>
                  <td>{ethBalance} ETH</td>
                  <td>${priceUsd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '--'}</td>
                  <td className={change24h != null && change24h >= 0 ? 'positive' : 'negative'}>
                    {change24h != null ? `${change24h.toFixed(2)}%` : '--'}
                  </td>
                  <td>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="info-card" style={{ marginTop: '1.5rem' }}>
            <p className="field-label">说明</p>
            <p className="small-note">
              当前仅展示链上原生资产 ETH 的真实余额与 CoinGecko 价格。若想继续扩展，可接入 ERC-20 代币余额 API 或链上资产索引服务。
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;
