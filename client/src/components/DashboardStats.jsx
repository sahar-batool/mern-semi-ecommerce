import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/admin';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  const maxSales = Math.max(...stats.dailySales.map((d) => d.sales), 1);

  return (
    <>
      <div className="stat-grid">
        <StatCard label="Total sales" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Users" value={`${stats.totalUsers} (+${stats.newUsers} this week)`} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>

      <h2>Orders by status</h2>
      <div className="stat-grid">
        {Object.entries(stats.ordersByStatus).map(([status, count]) => (
          <StatCard key={status} label={status} value={count} />
        ))}
      </div>
      <Link to="/admin/orders">View all orders</Link>

      <h2>Sales, last 7 days</h2>
      {stats.dailySales.length === 0 ? (
        <p>No sales in the last 7 days.</p>
      ) : (
        <div className="sales-bars">
          {stats.dailySales.map((d) => (
            <div key={d.date} className="sales-row">
              <span className="sales-date">{d.date}</span>
              <div className="sales-bar-track">
                <div className="sales-bar" style={{ width: `${(d.sales / maxSales) * 100}%` }} />
              </div>
              <span>Rs. {d.sales.toLocaleString()} ({d.orders})</span>
            </div>
          ))}
        </div>
      )}

      <h2>Low stock</h2>
      {stats.lowStock.length === 0 ? (
        <p>All products are well stocked.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr><th>Product</th><th>Stock</th></tr>
          </thead>
          <tbody>
            {stats.lowStock.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td className={p.stock === 0 ? 'out' : ''}>
                  {p.stock === 0 ? 'Sold out' : p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DashboardStats;