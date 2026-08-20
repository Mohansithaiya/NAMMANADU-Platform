import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../citizen/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand">NAMMANADU</Link>
          <div className="dashboard-user">
            <span className="dashboard-role-badge dashboard-role-super">{user?.role}</span>
            <span className="dashboard-user-name">{user?.full_name}</span>
            <button onClick={logout} className="dashboard-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h1>Welcome, {user?.full_name}!</h1>
          <p>Super Admin Dashboard — Coming soon in Phase 4</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <h3>Total Constituencies</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>Total Complaints</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>Active Admins</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>System Health</h3>
            <p className="stat-text">Operational</p>
          </div>
        </div>
      </main>
    </div>
  );
}
