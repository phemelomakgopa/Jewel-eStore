import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
    salesData: [],
    userGrowth: []
  });

  // Admin user emails (in a real app, this would be managed in the backend)
  const adminEmails = [
    'admin@jewel-estore.com',
    'manager@jewel-estore.com',
    'owner@jewel-estore.com'
  ];

  const isAdmin = () => {
    return user && adminEmails.includes(user.email);
  };

  // Mock analytics data
  const mockAnalytics = {
    totalRevenue: 125750.50,
    totalOrders: 342,
    totalProducts: 17,
    totalUsers: 1247,
    recentOrders: [
      {
        id: 'ORD-2024-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        total: 8999,
        status: 'completed',
        date: new Date('2024-08-14'),
        items: [
          { name: 'Diamond Ring', quantity: 1, price: 8999 }
        ]
      },
      {
        id: 'ORD-2024-002',
        customerName: 'Michael Chen',
        customerEmail: 'michael@example.com',
        total: 4599,
        status: 'processing',
        date: new Date('2024-08-13'),
        items: [
          { name: 'Chain & Pearly Bracelet', quantity: 1, price: 4599 }
        ]
      },
      {
        id: 'ORD-2024-003',
        customerName: 'Emma Davis',
        customerEmail: 'emma@example.com',
        total: 12598,
        status: 'shipped',
        date: new Date('2024-08-12'),
        items: [
          { name: 'Diamond Bracelet', quantity: 1, price: 9999 },
          { name: 'Bronze Ring', quantity: 1, price: 1999 },
          { name: 'Shipping', quantity: 1, price: 600 }
        ]
      }
    ],
    topProducts: [
      { id: 6, name: 'Diamond Ring', sales: 45, revenue: 404955 },
      { id: 4, name: 'Diamond Bracelet', sales: 32, revenue: 319968 },
      { id: 2, name: 'Chain & Pearly Bracelet', sales: 28, revenue: 128772 },
      { id: 5, name: 'Diamond Heart Earrings', sales: 24, revenue: 143976 },
      { id: 7, name: 'Diamond Stone and Gold Ring', sales: 19, revenue: 143450 }
    ],
    salesData: [
      { month: 'Jan', revenue: 8500, orders: 25 },
      { month: 'Feb', revenue: 12300, orders: 35 },
      { month: 'Mar', revenue: 15600, orders: 42 },
      { month: 'Apr', revenue: 18900, orders: 48 },
      { month: 'May', revenue: 22100, orders: 55 },
      { month: 'Jun', revenue: 19800, orders: 51 },
      { month: 'Jul', revenue: 25400, orders: 62 },
      { month: 'Aug', revenue: 28750, orders: 68 }
    ],
    userGrowth: [
      { month: 'Jan', users: 156 },
      { month: 'Feb', users: 189 },
      { month: 'Mar', users: 234 },
      { month: 'Apr', users: 278 },
      { month: 'May', users: 325 },
      { month: 'Jun', users: 389 },
      { month: 'Jul', users: 456 },
      { month: 'Aug', users: 523 }
    ]
  };

  // Load analytics data
  useEffect(() => {
    if (isAdmin()) {
      setAnalytics(mockAnalytics);
    }
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics(prev => ({
        ...prev,
        recentOrders: prev.recentOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrdersByStatus = (status) => {
    return analytics.recentOrders.filter(order => order.status === status);
  };

  const getOrdersByDateRange = (startDate, endDate) => {
    return analytics.recentOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const getTotalRevenueByMonth = (month, year) => {
    const monthData = analytics.salesData.find(data => 
      data.month.toLowerCase() === month.toLowerCase()
    );
    return monthData ? monthData.revenue : 0;
  };

  const getTopSellingProducts = (limit = 5) => {
    return analytics.topProducts
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
  };

  const getRevenueGrowth = () => {
    const currentMonth = analytics.salesData[analytics.salesData.length - 1];
    const previousMonth = analytics.salesData[analytics.salesData.length - 2];
    
    if (!currentMonth || !previousMonth) return 0;
    
    const growth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
    return Math.round(growth * 10) / 10;
  };

  const getOrderGrowth = () => {
    const currentMonth = analytics.salesData[analytics.salesData.length - 1];
    const previousMonth = analytics.salesData[analytics.salesData.length - 2];
    
    if (!currentMonth || !previousMonth) return 0;
    
    const growth = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100;
    return Math.round(growth * 10) / 10;
  };

  const getUserGrowth = () => {
    const currentMonth = analytics.userGrowth[analytics.userGrowth.length - 1];
    const previousMonth = analytics.userGrowth[analytics.userGrowth.length - 2];
    
    if (!currentMonth || !previousMonth) return 0;
    
    const growth = ((currentMonth.users - previousMonth.users) / previousMonth.users) * 100;
    return Math.round(growth * 10) / 10;
  };

  const getAverageOrderValue = () => {
    if (analytics.totalOrders === 0) return 0;
    return Math.round((analytics.totalRevenue / analytics.totalOrders) * 100) / 100;
  };

  const getOrderStatusCounts = () => {
    const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0, completed: 0, cancelled: 0 };
    
    analytics.recentOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    return counts;
  };

  const searchOrders = (query) => {
    if (!query.trim()) return analytics.recentOrders;
    
    const searchTerm = query.toLowerCase();
    return analytics.recentOrders.filter(order =>
      order.id.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm)
    );
  };

  const exportOrdersData = (format = 'csv') => {
    if (!isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    // In a real app, this would generate and download the file
    console.log(`Exporting orders data in ${format} format...`);
    
    if (format === 'csv') {
      const csvHeaders = 'Order ID,Customer Name,Customer Email,Total,Status,Date,Items\n';
      const csvData = analytics.recentOrders.map(order => {
        const items = order.items.map(item => `${item.name} (${item.quantity})`).join('; ');
        return `${order.id},${order.customerName},${order.customerEmail},${order.total/100},${order.status},${order.date.toISOString().split('T')[0]},"${items}"`;
      }).join('\n');
      
      const csvContent = csvHeaders + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const value = {
    isAdmin: isAdmin(),
    isLoading,
    analytics,
    updateOrderStatus,
    getOrdersByStatus,
    getOrdersByDateRange,
    getTotalRevenueByMonth,
    getTopSellingProducts,
    getRevenueGrowth,
    getOrderGrowth,
    getUserGrowth,
    getAverageOrderValue,
    getOrderStatusCounts,
    searchOrders,
    exportOrdersData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
