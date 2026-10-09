// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div>
          <p>You have no orders yet.</p>
          <Link to="/products" className="btn btn-secondary">Browse products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <div className="order-card" key={order._id}>
                <div className="order-card-info">
                  <p><strong>Order #{order._id.slice(-6)}</strong></p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Status: {order.status}</p>
                  <p>{itemCount} item(s)</p>
                </div>
                <div className="order-card-side">
                  <p className="order-card-total">Rs. {order.totalPrice}</p>
                  <Link to={`/order-confirmation/${order._id}`} className="btn btn-secondary">
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;