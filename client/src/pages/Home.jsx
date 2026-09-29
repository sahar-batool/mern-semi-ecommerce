import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
  <div className="home-hero">
    <h1>Welcome to Semi E-Commerce</h1>
    {user && <p>Hello, {user.name}!</p>}
    <p>Browse our products and find something you like.</p>
    <Link to="/products" className="btn btn-primary">Shop Now</Link>
  </div>
</div>
  );
};

export default Home;