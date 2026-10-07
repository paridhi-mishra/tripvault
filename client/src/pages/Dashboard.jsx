import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="card center">
      <h1>Welcome, {user?.name} 👋</h1>
      <p>{user?.email}</p>
      <p>Your trips will show up here in Week 2.</p>
      <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
    </div>
  );
}
