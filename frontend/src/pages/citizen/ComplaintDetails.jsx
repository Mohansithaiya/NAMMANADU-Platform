import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./ComplaintDetails.css";

const STATUS_LABELS = {
  submitted: "Submitted",
  under_review: "Under Review",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const STATUS_STEPS = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
];

const formatLabel = (value, fallback = "Not specified") => {
  if (!value) return fallback;

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatStatus = (status) => STATUS_LABELS[status] || formatLabel(status, "Unknown");

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  if (status === "resolved") return "status-resolved";
  if (status === "rejected") return "status-rejected";
  if (status === "under_review" || status === "assigned" || status === "in_progress") {
    return "status-progress";
  }
  return "status-submitted";
};

const getAssignedLabel = (assignedTo) => {
  if (!assignedTo) return "Not assigned yet";
  if (typeof assignedTo === "string") return assignedTo;

  return (
    assignedTo.full_name ||
    assignedTo.name ||
    assignedTo.email ||
    assignedTo._id ||
    "Assigned authority"
  );
};

const getErrorMessage = (error) => {
  if (error.response?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (error.response?.status === 403) {
    return "You are not authorized to view this complaint.";
  }
  if (error.response?.status === 404) {
    return "Complaint not found or it is not available in your account.";
  }

  return error.response?.data?.message || "Unable to load this complaint. Please try again.";
};

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaint = useCallback(async () => {
    if (!id) {
      setError("This complaint link is incomplete.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data?.data?.complaint || null);
    } catch (requestError) {
      console.error("Failed to fetch complaint details:", requestError);
      setComplaint(null);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      fetchComplaint();
    }, 0);

    return () => window.clearTimeout(requestId);
  }, [fetchComplaint]);

  const currentStatus = complaint?.status || "submitted";
  const currentStep = useMemo(() => STATUS_STEPS.indexOf(currentStatus), [currentStatus]);
  const isRejected = currentStatus === "rejected";

  return (
    <div className="dashboard-page complaint-details-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand">NAMMANADU</Link>

          <div className="dashboard-user">
            <span className="dashboard-role-badge">{user?.role || "citizen"}</span>
            <span className="dashboard-user-name">{user?.full_name}</span>
            <button onClick={logout} className="dashboard-logout">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <Link to="/citizen/dashboard" className="complaint-details-back">
          ← Back to My Complaints
        </Link>

        {loading && (
          <div className="dashboard-state complaint-details-state" role="status" aria-live="polite">
            <p>Loading complaint details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-state dashboard-error complaint-details-state" role="alert">
            <p>{error}</p>
            <button onClick={fetchComplaint} className="dashboard-retry">Try Again</button>
          </div>
        )}

        {!loading && !error && !complaint && (
          <div className="dashboard-state dashboard-empty complaint-details-state">
            <h1>Complaint unavailable</h1>
            <p>We could not find the requested complaint in your account.</p>
          </div>
        )}

        {!loading && !error && complaint && (
          <article className="complaint-details-card">
            <header className="complaint-details-header">
              <div>
                <span className="complaint-tracking-id">{complaint.tracking_id || "No tracking ID"}</span>
                <h1>{complaint.title || "Untitled Complaint"}</h1>
              </div>
              <span className={`complaint-status ${getStatusClass(currentStatus)}`}>
                {formatStatus(currentStatus)}
              </span>
            </header>

            <section className={`complaint-progress-panel ${isRejected ? "complaint-progress-rejected" : ""}`}>
              <div className="complaint-details-section-heading">
                <div>
                  <p className="complaint-details-eyebrow">Complaint progress</p>
                  <h2>{isRejected ? "Complaint rejected" : `Current status: ${formatStatus(currentStatus)}`}</h2>
                </div>
                <span className="complaint-progress-date">Submitted {formatDate(complaint.createdAt)}</span>
              </div>

              {isRejected ? (
                <p className="complaint-progress-message">
                  This complaint was marked as rejected. Please review the authority&apos;s note below if one is available.
                </p>
              ) : (
                <ol className="complaint-progress-steps" aria-label="Complaint status progress">
                  {STATUS_STEPS.map((step, index) => {
                    const isComplete = currentStep >= index;
                    const isCurrent = currentStatus === step;

                    return (
                      <li key={step} className={isComplete ? "is-complete" : ""}>
                        <span className={`complaint-progress-marker ${isCurrent ? "is-current" : ""}`}>
                          {isComplete ? "✓" : index + 1}
                        </span>
                        <span>{formatStatus(step)}</span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            <section className="complaint-details-section">
              <div className="complaint-details-section-heading">
                <div>
                  <p className="complaint-details-eyebrow">Reported issue</p>
                  <h2>Complaint information</h2>
                </div>
              </div>

              <div className="complaint-detail-grid">
                <div>
                  <span>Category</span>
                  <strong>{formatLabel(complaint.category)}</strong>
                </div>
                <div>
                  <span>Priority</span>
                  <strong>{formatLabel(complaint.priority, "Medium")}</strong>
                </div>
                <div>
                  <span>District</span>
                  <strong>{formatLabel(complaint.district)}</strong>
                </div>
                <div>
                  <span>Constituency</span>
                  <strong>{formatLabel(complaint.constituency)}</strong>
                </div>
                <div className="complaint-detail-full-width">
                  <span>Address or landmark</span>
                  <strong>{formatLabel(complaint.address)}</strong>
                </div>
                <div className="complaint-detail-full-width">
                  <span>Submitted on</span>
                  <strong>{formatDate(complaint.createdAt)}</strong>
                </div>
              </div>
            </section>

            <section className="complaint-details-section complaint-description-section">
              <p className="complaint-details-eyebrow">Citizen description</p>
              <h2>Description</h2>
              <p>{complaint.description || "No description provided."}</p>
            </section>

            <section className="complaint-details-section">
              <p className="complaint-details-eyebrow">Authority handling</p>
              <h2>Assigned information</h2>
              <p className="complaint-assigned-value">{getAssignedLabel(complaint.assigned_to)}</p>
              {complaint.resolution_note && (
                <div className="complaint-resolution-note">
                  <span>Resolution note</span>
                  <p>{complaint.resolution_note}</p>
                </div>
              )}
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
