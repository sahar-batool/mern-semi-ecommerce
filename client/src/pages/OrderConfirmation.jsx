// src/pages/OrderConfirmation.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/orders';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import PaymentBadge from '../components/PaymentBadge';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;

    setCancelling(true);
    setActionError('');

    try {
      const data = await cancelOrder(order._id);
      setOrder({ ...order, status: data.order.status });
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={error} />
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>
        {order.status === 'pending' ? 'Thank you, your order was placed!' : 'Order Details'}
      </h1>
      <p>Order ID: {order._id}</p>
      <p>
        Status: <span className={`status status-${order.status}`}>{order.status}</span>
      </p>

      <div className="checkout-review">
        <h2>Items</h2>
        {order.items.map((item, index) => (
          <div className="checkout-item" key={`${item.product}-${index}`}>
            <span>{item.name} × {item.quantity}</span>
            <span>Rs. {item.price * item.quantity}</span>
          </div>
        ))}
        <h3>Total: Rs. {order.totalPrice}</h3>
      </div>

      {order.shippingAddress && (
        <div className="confirmation-address">
          <h2>Shipping To</h2>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>
      )}

      {actionError && <ErrorMessage message={actionError} />}

      {order.status === 'pending' && (
        <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}

<p>Payment method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
<p>Payment: <PaymentBadge order={order} /></p>

      <div className="confirmation-links">
        <Link to="/orders" className="btn btn-primary">View my orders</Link>
        <Link to="/products" className="btn btn-secondary">Continue shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;