// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const Cart = () => {
  const { items, loading, error, updateItem, removeItem, clearAll, total } = useCart();

  // Skip rows whose product was deleted from the database
  const validItems = items.filter((item) => item.product);

  if (loading && validItems.length === 0) return <LoadingIndicator />;

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {error && <ErrorMessage message={error} />}

      {validItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-secondary">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {validItems.map((item) => {
              const { product, quantity } = item;
              return (
                <div className="cart-item" key={product._id}>
                  {product.image && (
                    <img className="cart-item-image" src={product.image} alt={product.name} />
                  )}

                  <div className="cart-item-info">
                    <Link to={`/products/${product._id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p>Rs. {product.price}</p>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      onClick={() => updateItem(product._id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
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

                  <button className="cart-item-remove" onClick={() => removeItem(product._id)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Total: Rs. {total}</h2>
            <button className="btn btn-secondary" onClick={clearAll}>
              Clear Cart
            </button>
            <Link to="/checkout" className="btn btn-primary">
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;