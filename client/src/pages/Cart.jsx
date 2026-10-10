// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const Cart = () => {
  const { items, loading, error, updateItem, removeItem, clearAll, total, itemCount } = useCart();

  // Skip rows whose product was deleted from the database
  const validItems = items.filter((item) => item.product);

  if (loading && validItems.length === 0) return <LoadingIndicator />;

  return (
    <div className="container">
      <h1>
        Your Cart <span className="cart-count">({itemCount} items)</span>
      </h1>

      {error && <ErrorMessage message={error} />}

      {validItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {validItems.map(({ product, quantity }) => (
              <div className="cart-item" key={product._id}>
                {product.image && (
                  <img className="cart-item-image" src={product.image} alt={product.name} />
                )}

                <div className="cart-item-info">
                  <Link to={`/products/${product._id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <p className="cart-item-price">Rs. {product.price} each</p>
                  <button className="cart-item-remove" onClick={() => removeItem(product._id)}>
                    Remove
                  </button>
                </div>

                <div className="cart-item-qty">
                  <button
                    onClick={() => updateItem(product._id, quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => updateItem(product._id, quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-total">Rs. {product.price * quantity}</p>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary summary-btn">
              Proceed to Checkout
            </Link>
            <button className="btn btn-secondary summary-btn" onClick={clearAll}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;