// 中文：Login 页面（简单模拟）
// EN: Login page (simple mock)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('');
  const { state, login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(username, password);
    navigate('/');
  }

  return (
    <div>
      <h2>登录 / Login</h2>
      {state.loading ? <div>正在登录...</div> : null}
      <form onSubmit={handleSubmit}>
        <div>
          <label>用户名 / Username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>密码 / Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">登录 / Login</button>
      </form>
    </div>
  );
};

export default Login;
