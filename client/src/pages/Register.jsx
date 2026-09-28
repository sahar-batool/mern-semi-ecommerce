import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;