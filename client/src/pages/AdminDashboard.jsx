import { Link } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';

const links = [
  { to: '/admin', title: 'Products', desc: 'Add, edit and delete products' },
  { to: '/admin/orders', title: 'Orders', desc: 'View orders and update status' },
  { to: '/profile', title: 'Profile', desc: 'Change your username' },
];

const AdminDashboard = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="admin-links">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="admin-link-card">
            <h3>{l.title}</h3>
            <p>{l.desc}</p>
          </Link>
        ))}
      </div>

      <DashboardStats />
    </div>
  );
};

export default AdminDashboard;