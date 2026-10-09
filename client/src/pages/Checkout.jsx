
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';
import ErrorMessage from '../components/ErrorMessage';

const Checkout = () => {
  const { items, total, loadCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validItems = items.filter((item) => item.product);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = await placeOrder(shippingAddress);
      await loadCart();
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (validItems.length === 0) {
    return (
      <div className="container">
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn btn-secondary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      <div className="checkout-review">
        <h2>Order Summary</h2>
        {validItems.map(({ product, quantity }) => (
          <div className="checkout-item" key={product._id}>
            <span>{product.name} × {quantity}</span>
            <span>Rs. {product.price * quantity}</span>
          </div>
        ))}
        <h3>Total: Rs. {total}</h3>
      </div>

      <form className="checkout-form" onSubmit={handlePlaceOrder}>
        <h2>Shipping Details</h2>

        <input name="fullName" placeholder="Full name" value={shippingAddress.fullName} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={shippingAddress.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={shippingAddress.city} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={shippingAddress.phone} onChange={handleChange} required />

        {error && <ErrorMessage message={error} />}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;