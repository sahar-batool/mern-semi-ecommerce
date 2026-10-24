// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import PaymentBadge from '../components/PaymentBadge';

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
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>When you place an order, it will show up here.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <div className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div>
                    <p className="order-number">Order #{order._id.slice(-6)}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </div>
                <PaymentBadge order={order} />

                <div className="order-card-thumbs">
                  {order.items.slice(0, 4).map((i, index) =>
                    i.image ? (
                      <img
                        key={`${i.product}-${index}`}
                        className="order-thumb"
                        src={i.image}
                        alt={i.name}
                      />
                    ) : null
                  )}
                  {order.items.length > 4 && (
                    <span className="order-more">+{order.items.length - 4}</span>
                  )}
                </div>

                <div className="order-card-footer">
                  <div>
                    <p className="order-items-count">{itemCount} item(s)</p>
                    <p className="order-card-total">Rs. {order.totalPrice}</p>
                  </div>
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