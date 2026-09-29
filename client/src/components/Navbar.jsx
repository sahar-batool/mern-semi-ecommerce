import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
  <Link to="/" className="navbar-brand">Semi E-Commerce</Link>
  <div className="navbar-links">
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/products" className="nav-link">Products</Link>
    {user ? (
      <>
        <Link to="/profile" className="nav-link">Profile</Link>
        {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
        <button onClick={logout} className="logout-btn">Logout</button>
      </>
    ) : (
      <>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </>
    )}
  </div>
</nav>
  );
};

export default Navbar;