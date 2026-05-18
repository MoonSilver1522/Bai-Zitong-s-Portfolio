import React, { useReducer, useEffect } from 'react';
import { AuthContext } from './AuthContextCore';

declare global {
  interface Window {
    ethereum?: {
      request: (options: { method: string; params?: Array<unknown> }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

type State = {
  walletAddress: string | null;
  chainId: string | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'connect_start' }
  | { type: 'connect_success'; walletAddress: string; chainId: string | null }
  | { type: 'connect_error'; error: string }
  | { type: 'disconnect' }
  | { type: 'chain_changed'; chainId: string };

const initialState: State = {
  walletAddress: null,
  chainId: null,
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect_start':
      return { ...state, loading: true, error: null };
    case 'connect_success':
      return {
        walletAddress: action.walletAddress,
        chainId: action.chainId,
        loading: false,
        error: null,
      };
    case 'connect_error':
      return { ...state, loading: false, error: action.error };
    case 'disconnect':
      return { walletAddress: null, chainId: null, loading: false, error: null };
    case 'chain_changed':
      return { ...state, chainId: action.chainId };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 连接钱包的核心函数，处理连接流程与错误
  async function connectWallet(): Promise<boolean> {
    const provider = window.ethereum;
    if (!provider) {
      dispatch({ type: 'connect_error', error: '请安装 MetaMask 或其他 Web3 钱包' });
      return false;
    }

    dispatch({ type: 'connect_start' });

    try {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      const walletAddress = accounts?.[0]?.toLowerCase() ?? null;

      if (!walletAddress) {
        throw new Error('未获取钱包地址');
      }

      localStorage.setItem('wallet_address', walletAddress);
      if (chainId) {
        localStorage.setItem('wallet_chain_id', chainId);
      }

      dispatch({ type: 'connect_success', walletAddress, chainId: chainId || null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : '连接钱包失败';
      dispatch({ type: 'connect_error', error: message });
      return false;
    }
  }

  function clearSession() {
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_chain_id');
    dispatch({ type: 'disconnect' });
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem('wallet_address');
    const storedChainId = localStorage.getItem('wallet_chain_id');
    if (storedAddress) {
      dispatch({ type: 'connect_success', walletAddress: storedAddress, chainId: storedChainId });
    }
  }, []);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        const walletAddress = accounts[0].toLowerCase();
        localStorage.setItem('wallet_address', walletAddress);
        dispatch({ type: 'connect_success', walletAddress, chainId: state.chainId });
      } else {
        clearSession();
      }
    };

    const handleChainChanged = (chainId: string) => {
      localStorage.setItem('wallet_chain_id', chainId);
      dispatch({ type: 'chain_changed', chainId });
    };

    provider.on('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
    provider.on('chainChanged', handleChainChanged as (...args: unknown[]) => void);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
      provider.removeListener?.('chainChanged', handleChainChanged as (...args: unknown[]) => void);
    };
  }, [state.chainId]);

  return <AuthContext.Provider value={{ state, connectWallet }}>{children}</AuthContext.Provider>;
};
