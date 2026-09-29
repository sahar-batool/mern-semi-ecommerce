import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className="container">
  <div className="auth-page">
    <h1>Login</h1>
    <LoginForm />
    <p className="auth-switch">
      Don't have an account? <Link to="/register">Register</Link>
    </p>
  </div>
</div>
  );
};

export default Login;