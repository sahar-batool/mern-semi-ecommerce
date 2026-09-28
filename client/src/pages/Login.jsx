import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;