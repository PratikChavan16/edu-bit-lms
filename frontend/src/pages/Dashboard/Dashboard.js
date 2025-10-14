import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp, 
  FiAlertCircle 
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/payments/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const paymentModeData = stats?.paymentsByMode?.map(item => ({
    name: item._id.toUpperCase(),
    value: item.total,
    count: item.count
  })) || [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}</h1>
        <p>
          {isAdmin 
            ? 'Admin Portal - Complete Fee Management Overview' 
            : 'Accountant Portal - Online Payments Management'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>💳 Fee Collection (For Tally)</h3>
            <p className="stat-value">₹{stats?.feeCollected?.toLocaleString() || 0}</p>
            <span className="stat-note">Tuition fee payments only</span>
          </div>
        </div>

        {stats?.isAdmin && (
          <div className="stat-card warning">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3>💵 Cash Charges (Extra Fees)</h3>
              <p className="stat-value">₹{stats?.cashCollected?.toLocaleString() || 0}</p>
              <span className="stat-note">Library fines, lab fees, etc. - Admin only</span>
            </div>
          </div>
        )}

        <div className="stat-card success">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>Online Payments</h3>
            <p className="stat-value">₹{stats?.onlineCollected?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-value">{stats?.totalStudents || 0}</p>
            <span className="stat-note">{stats?.activeStudents || 0} active</span>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>Pending Fees</h3>
            <p className="stat-value">₹{stats?.totalPending?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Payment Mode Distribution</h3>
          {paymentModeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No payment data available</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Payment Methods Breakdown</h3>
          {paymentModeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentModeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" name="Amount (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No payment data available</p>
          )}
        </div>
      </div>

      <div className="recent-payments">
        <h3>Recent Payments</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentPayments?.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.receiptNumber}</td>
                  <td>{payment.studentName}</td>
                  <td>{payment.enrollmentNumber}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${payment.paymentMode === 'cash' ? 'warning' : 'success'}`}>
                      {payment.paymentMode.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.recentPayments || stats.recentPayments.length === 0) && (
            <p className="no-data">No recent payments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
