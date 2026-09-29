import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      {product.image && (
        <img className="product-card-image" src={product.image} alt={product.name} />
      )}
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">Rs. {product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;