import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Dashboard.css";

const STATUS_LABELS = {
  submitted: "Submitted",
  pending: "Pending",
  in_progress: "In Progress",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  closed: "Closed",
};

const formatStatus = (status) => {
  const normalized = String(status || "").toLowerCase().trim();

  return (
    STATUS_LABELS[normalized] ||
    normalized
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
    "Unknown"
  );
};

const formatCategory = (category) => {
  if (!category) return "General";

  return String(category)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STATUS_FILTER_OPTIONS = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

const getComplaintStatus = (complaint) =>
  String(complaint.status || complaint.complaint_status || "")
    .toLowerCase()
    .trim();

const getComplaintTitle = (complaint) =>
  complaint.title || complaint.complaint_title || "";

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase().trim();

  if (normalized === "resolved" || normalized === "closed") {
    return "status-resolved";
  }

  if (
    normalized === "in_progress" ||
    normalized === "in-progress" ||
    normalized === "pending"
  ) {
    return "status-progress";
  }

  if (normalized === "rejected") {
    return "status-rejected";
  }

  return "status-submitted";
};

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints");

      const responseData = response?.data;

      const complaintList =
        responseData?.data?.complaints ||
        responseData?.complaints ||
        responseData?.items ||
        (Array.isArray(responseData) ? responseData : []);

      setComplaints(Array.isArray(complaintList) ? complaintList : []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      fetchComplaints();
    }, 0);

    return () => window.clearTimeout(requestId);
  }, [fetchComplaints]);

  const stats = useMemo(() => {
    const total = complaints.length;

    const submitted = complaints.filter((complaint) => {
      const status = String(
        complaint.status || complaint.complaint_status || ""
      )
        .toLowerCase()
        .trim();

      return status === "submitted";
    }).length;

    const inProgress = complaints.filter((complaint) => {
      const status = String(
        complaint.status || complaint.complaint_status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "in_progress" ||
        status === "in-progress" ||
        status === "pending"
      );
    }).length;

    const resolved = complaints.filter((complaint) => {
      const status = String(
        complaint.status || complaint.complaint_status || ""
      )
        .toLowerCase()
        .trim();

      return status === "resolved" || status === "closed";
    }).length;

    return {
      total,
      submitted,
      inProgress,
      resolved,
    };
  }, [complaints]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        complaints
          .map((complaint) => String(complaint.category || "").trim())
          .filter(Boolean)
      )
    ).sort((first, second) => first.localeCompare(second));
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const searchableFields = [
        complaint.tracking_id,
        getComplaintTitle(complaint),
        complaint.category,
      ];
      const matchesSearch =
        !normalizedSearch ||
        searchableFields.some((field) =>
          String(field || "").toLowerCase().includes(normalizedSearch)
        );
      const matchesStatus =
        !statusFilter || getComplaintStatus(complaint) === statusFilter;
      const matchesCategory =
        !categoryFilter ||
        String(complaint.category || "").trim() === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, complaints, searchTerm, statusFilter]);

  const hasActiveFilters = Boolean(searchTerm || statusFilter || categoryFilter);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand">
            NAMMANADU
          </Link>

          <div className="dashboard-user">
            <span className="dashboard-role-badge">
              {user?.role || "citizen"}
            </span>

            <span className="dashboard-user-name">
              {user?.full_name}
            </span>

            <button
              onClick={logout}
              className="dashboard-logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h1>Welcome, {user?.full_name}!</h1>
          <p>Track your civic complaints and their progress.</p>
          <Link to="/citizen/complaints/new" className="dashboard-primary-action">
            File a Complaint
          </Link>
        </div>

        {/* Statistics */}
        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <h3>Complaints Filed</h3>
            <p className="stat-number">{stats.total}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Submitted</h3>
            <p className="stat-number">{stats.submitted}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolved}</p>
          </div>
        </div>

        {/* Complaints section */}
        <section className="complaints-section">
          <div className="section-header">
            <div>
              <h2>My Complaints</h2>
              <p>Complaints submitted through NAMMANADU</p>
            </div>
          </div>

          {!loading && !error && complaints.length > 0 && (
            <div className="complaint-filters" aria-label="Search and filter complaints">
              <div className="complaint-search-field">
                <label htmlFor="complaint-search">Search complaints</label>
                <input
                  id="complaint-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by tracking ID, title, or category"
                />
              </div>

              <div className="complaint-filter-field">
                <label htmlFor="complaint-status-filter">Status</label>
                <select
                  id="complaint-status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="">All statuses</option>
                  {STATUS_FILTER_OPTIONS.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </div>

              <div className="complaint-filter-field">
                <label htmlFor="complaint-category-filter">Category</label>
                <select
                  id="complaint-category-filter"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{formatCategory(category)}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="complaint-clear-filters"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear filters
              </button>
            </div>
          )}

          {loading && (
            <div className="dashboard-state">
              <p>Loading your complaints...</p>
            </div>
          )}

          {!loading && error && (
            <div className="dashboard-state dashboard-error">
              <p>{error}</p>

              <button
                onClick={fetchComplaints}
                className="dashboard-retry"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && complaints.length === 0 && (
            <div className="dashboard-state dashboard-empty">
              <h3>No complaints yet</h3>
              <p>
                You have not submitted any civic complaints yet.
              </p>
            </div>
          )}

          {!loading && !error && complaints.length > 0 && filteredComplaints.length === 0 && (
            <div className="dashboard-state dashboard-empty">
              <h3>No matching complaints</h3>
              <p>Try adjusting your search or filters.</p>
              <button type="button" className="dashboard-retry" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && filteredComplaints.length > 0 && (
            <div className="complaints-list">
              {filteredComplaints.map((complaint) => {
                const title =
                  complaint.title ||
                  complaint.complaint_title ||
                  "Untitled Complaint";

                const status =
                  complaint.status ||
                  complaint.complaint_status ||
                  "submitted";

                const createdAt =
                  complaint.createdAt ||
                  complaint.created_at;

                return (
                  <article
                    key={complaint._id || complaint.tracking_id}
                    className="complaint-card"
                  >
                    <div className="complaint-card-header">
                      <div>
                        {complaint._id ? (
                          <Link
                            to={`/citizen/complaints/${complaint._id}`}
                            className="complaint-tracking-link"
                          >
                            {complaint.tracking_id || "View complaint details"}
                          </Link>
                        ) : (
                          <span className="complaint-tracking-id">
                            {complaint.tracking_id || "No tracking ID"}
                          </span>
                        )}

                        <h3>{title}</h3>
                      </div>

                      <span
                        className={`complaint-status ${getStatusClass(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </div>

                    {complaint.description && (
                      <p className="complaint-description">
                        {complaint.description}
                      </p>
                    )}

                    <div className="complaint-meta">
                      <div>
                        <span>Category</span>
                        <strong>
                          {formatCategory(complaint.category)}
                        </strong>
                      </div>

                      <div>
                        <span>District</span>
                        <strong>
                          {complaint.district || "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>Priority</span>
                        <strong>
                          {formatCategory(complaint.priority || "medium")}
                        </strong>
                      </div>

                      <div>
                        <span>Submitted</span>
                        <strong>{formatDate(createdAt)}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Reward points */}
        <section className="reward-card">
          <div>
            <h2>Reward Points</h2>
            <p>
              Earn points by actively participating in civic
              improvement.
            </p>
          </div>

          <span className="reward-number">
            {user?.reward_points || 0}
          </span>
        </section>
      </main>
    </div>
  );
}