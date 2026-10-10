// src/pages/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getAllOrders();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setActionError('');
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      // Keep the populated user; only update the status
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: data.order.status } : o))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <LoadingIndicator />;

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>All Orders</h1>

      {actionError && <ErrorMessage message={actionError} />}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                const locked = ['delivered', 'cancelled'].includes(order.status);
                return (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>
                      {order.user?.name || 'Deleted user'}
                      <br />
                      <small>{order.user?.email}</small>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{itemCount}</td>
                    <td>Rs. {order.totalPrice}</td>
                    <td>
                      <span className={`status status-${order.status}`}>{order.status}</span>
                      <select
                        className="status-select"
                        value={order.status}
                        disabled={locked}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;