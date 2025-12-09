// 中文：提供简单的认证上下文（模拟登录）
// EN: Simple Auth context for mock login
import React, { createContext, useReducer, useContext } from 'react';

type User = { id: string; username: string } | null;
type State = { user: User; loading: boolean };

type Action =
  | { type: 'login_start' }
  | { type: 'login_success'; user: User }
  | { type: 'logout' };

const initialState: State = { user: null, loading: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login_start':
      return { ...state, loading: true };
    case 'login_success':
      return { user: action.user, loading: false };
    case 'logout':
      return { user: null, loading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: State;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 中文：模拟登录函数，延迟后设置用户
  // EN: mock login function, set user after a timeout
  async function login(username: string, password: string) {
    dispatch({ type: 'login_start' });
    await new Promise((res) => setTimeout(res, 600)); // 模拟网络延时
    const user = { id: Date.now().toString(), username };
    // 简单保存到 localStorage 以便刷新后仍可保持（演示用途）
    localStorage.setItem('mock_user', JSON.stringify(user));
    dispatch({ type: 'login_success', user });
  }

  function logout() {
    localStorage.removeItem('mock_user');
    dispatch({ type: 'logout' });
  }

  // 初始化：如果 localStorage 有用户，直接登录（页面刷新时保留会话）
  React.useEffect(() => {
    const raw = localStorage.getItem('mock_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        dispatch({ type: 'login_success', user: u });
      } catch {}
    }
  }, []);

  return <AuthContext.Provider value={{ state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
