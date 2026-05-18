import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="page-card">
      <div className="dashboard-header">
        <h2>企业级仪表盘</h2>
        <p>欢迎使用 Zitong Bai's Dashboard。该项目采用 Web3 钱包登录方案，面向后续企业级迭代打造。</p>
      </div>

      <div className="card-grid">
        <section className="info-card">
          <h3>系统概览</h3>
          <p>项目已精简为可扩展的企业级骨架，保留核心页面结构与登录能力。</p>
        </section>

        <section className="info-card">
          <h3>安全认证</h3>
          <p>登录方式已迁移至 Web3 钱包，避免传统用户名/密码方案带来的维护负担。</p>
        </section>

        <section className="info-card">
          <h3>开发效率</h3>
          <p>使用 Vite + React + TypeScript，支持快速迭代与后续模块化扩展。</p>
        </section>

        <section className="info-card">
          <h3>下一步</h3>
          <p>您可以继续构建企业级报表、权限管理、数据服务和钱包交易模块。</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
