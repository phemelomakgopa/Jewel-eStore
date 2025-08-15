import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { 
    isAdmin, 
    analytics, 
    getRevenueGrowth, 
    getOrderGrowth, 
    getUserGrowth,
    getAverageOrderValue,
    getOrderStatusCounts,
    getTopSellingProducts
  } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const revenueGrowth = getRevenueGrowth();
  const orderGrowth = getOrderGrowth();
  const userGrowth = getUserGrowth();
  const avgOrderValue = getAverageOrderValue();
  const orderStatusCounts = getOrderStatusCounts();
  const topProducts = getTopSellingProducts();

  const formatCurrency = (amount) => {
    return `R${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return (
        <svg className="growth-icon positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (growth < 0) {
      return (
        <svg className="growth-icon negative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, growth, icon, color = 'blue' }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon">
          {icon}
        </div>
        <div className="stat-growth">
          {getGrowthIcon(growth)}
          <span className={`growth-text ${growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral'}`}>
            {growth > 0 ? '+' : ''}{growth}%
          </span>
        </div>
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.displayName || user?.email}</p>
        </div>
        <div className="admin-actions">
          <button 
            className="admin-btn secondary"
            onClick={() => navigate('/admin/products')}
          >
            Manage Products
          </button>
          <button 
            className="admin-btn secondary"
            onClick={() => navigate('/admin/orders')}
          >
            View Orders
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Recent Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Key Metrics */}
            <div className="stats-grid">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(analytics.totalRevenue * 100)}
                growth={revenueGrowth}
                color="green"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                }
              />
              <StatCard
                title="Total Orders"
                value={analytics.totalOrders.toLocaleString()}
                growth={orderGrowth}
                color="blue"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
              />
              <StatCard
                title="Total Users"
                value={analytics.totalUsers.toLocaleString()}
                growth={userGrowth}
                color="purple"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Avg Order Value"
                value={formatCurrency(avgOrderValue * 100)}
                growth={0}
                color="orange"
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>

            {/* Order Status Overview */}
            <div className="order-status-overview">
              <h3>Order Status Overview</h3>
              <div className="status-grid">
                {Object.entries(orderStatusCounts).map(([status, count]) => (
                  <div key={status} className={`status-card ${status}`}>
                    <div className="status-count">{count}</div>
                    <div className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="top-products">
              <h3>Top Selling Products</h3>
              <div className="products-table">
                <div className="table-header">
                  <div>Product</div>
                  <div>Sales</div>
                  <div>Revenue</div>
                </div>
                {topProducts.map((product, index) => (
                  <div key={product.id} className="table-row">
                    <div className="product-info">
                      <span className="product-rank">#{index + 1}</span>
                      <span className="product-name">{product.name}</span>
                    </div>
                    <div className="product-sales">{product.sales} units</div>
                    <div className="product-revenue">{formatCurrency(product.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-charts">
              <div className="chart-container">
                <h3>Monthly Revenue</h3>
                <div className="simple-chart">
                  {analytics.salesData.map((data, index) => (
                    <div key={data.month} className="chart-bar">
                      <div 
                        className="bar"
                        style={{ 
                          height: `${(data.revenue / Math.max(...analytics.salesData.map(d => d.revenue))) * 100}%` 
                        }}
                      ></div>
                      <div className="bar-label">{data.month}</div>
                      <div className="bar-value">{formatCurrency(data.revenue * 100)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>Monthly Orders</h3>
                <div className="simple-chart">
                  {analytics.salesData.map((data, index) => (
                    <div key={data.month} className="chart-bar">
                      <div 
                        className="bar orders"
                        style={{ 
                          height: `${(data.orders / Math.max(...analytics.salesData.map(d => d.orders))) * 100}%` 
                        }}
                      ></div>
                      <div className="bar-label">{data.month}</div>
                      <div className="bar-value">{data.orders}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="orders-header">
              <h3>Recent Orders</h3>
              <button 
                className="admin-btn primary"
                onClick={() => navigate('/admin/orders')}
              >
                View All Orders
              </button>
            </div>
            <div className="orders-table">
              <div className="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Total</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              {analytics.recentOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="table-row">
                  <div className="order-id">{order.id}</div>
                  <div className="customer-info">
                    <div className="customer-name">{order.customerName}</div>
                    <div className="customer-email">{order.customerEmail}</div>
                  </div>
                  <div className="order-total">{formatCurrency(order.total)}</div>
                  <div className={`order-status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div className="order-date">{formatDate(order.date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
