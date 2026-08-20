import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand">NAMMANADU</Link>
          <div className="dashboard-user">
            <span className="dashboard-role-badge">{user?.role}</span>
            <span className="dashboard-user-name">{user?.full_name}</span>
            <button onClick={logout} className="dashboard-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h1>Welcome, {user?.full_name}!</h1>
          <p>Citizen Dashboard — Coming soon in Phase 2</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <h3>Complaints Filed</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>Resolved</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="dashboard-stat-card">
            <h3>Reward Points</h3>
            <p className="stat-number">{user?.reward_points || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
