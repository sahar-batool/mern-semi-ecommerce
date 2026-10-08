import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const qty = Math.min(Math.max(quantity || 1, 1), product.stock);
    addItem(product._id, qty);
  };

  if (loading) return <LoadingIndicator />;

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link
        to="/products"
        className="btn btn-secondary"
        style={{ marginBottom: '1rem', display: 'inline-block' }}
      >
        Back to products
      </Link>

      <div className="product-details">
        {product.image && (
          <img
            className="product-details-image"
            src={product.image}
            alt={product.name}
          />
        )}
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="product-details-price">Rs. {product.price}</p>
          <p>Category: {product.category}</p>
          <p>{product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}</p>

          {product.stock > 0 && (
            <input
              type="number"
              className="quantity-input"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          )}

          <button
            className="add-to-cart-btn details-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;