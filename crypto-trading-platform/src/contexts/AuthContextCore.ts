import { createContext } from 'react';

export type AuthState = {
  walletAddress: string | null;
  chainId: string | null;
  loading: boolean;
  error: string | null;
};

export type AuthContextValue = {
  state: AuthState;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
