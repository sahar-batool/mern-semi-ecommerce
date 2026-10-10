import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  { icon: '🚚', title: 'Fast Delivery', text: 'Get your orders delivered quickly to your door.' },
  { icon: '🔒', title: 'Secure Login', text: 'Your account and password are always protected.' },
  { icon: '↩️', title: 'Easy Returns', text: 'Changed your mind? Cancel pending orders anytime.' },
];

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

      <section className="features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;