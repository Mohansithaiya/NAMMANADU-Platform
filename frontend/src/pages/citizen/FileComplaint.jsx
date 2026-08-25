import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../auth/Auth.css";
import "./FileComplaint.css";

const CATEGORIES = [
  { value: "sanitation", label: "Sanitation" },
  { value: "water", label: "Water supply" },
  { value: "roads", label: "Roads" },
  { value: "electricity", label: "Electricity" },
  { value: "streetlights", label: "Streetlights" },
  { value: "drainage", label: "Drainage" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

function getSubmissionError(error) {
  if (error.response?.status === 401) {
    return "Your session has expired. Please sign in again before filing a complaint.";
  }
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) {
    return "Unable to reach NAMMANADU. Please check your connection and try again.";
  }
  return "We could not submit your complaint. Please try again.";
}

function getTrackingId(response) {
  return response?.data?.data?.complaint?.tracking_id || response?.data?.complaint?.tracking_id || "";
}

export default function FileComplaint() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    district: user?.district || "",
    constituency: user?.constituency || "",
    address: "",
    priority: "medium",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      district: form.district.trim(),
      constituency: form.constituency.trim(),
      address: form.address.trim(),
      priority: form.priority,
    };

    if (!payload.title || !payload.description || !payload.category || !payload.district) {
      setError("Title, description, category, and district are required.");
      return;
    }
    if (payload.title.length > 200) {
      setError("Title must be 200 characters or fewer.");
      return;
    }
    if (payload.description.length > 2000) {
      setError("Description must be 2000 characters or fewer.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/complaints", payload);
      setSuccess({
        message: response.data?.message || "Complaint submitted successfully.",
        trackingId: getTrackingId(response),
      });
      setForm((previous) => ({
        ...previous,
        title: "",
        description: "",
        category: "",
        address: "",
      }));
    } catch (requestError) {
      setError(getSubmissionError(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page complaint-page">
        <div className="auth-card complaint-success-card" role="status" aria-live="polite">
          <div className="auth-brand">
            <span className="auth-logo">N</span>
            <h1>NAMMANADU</h1>
            <p className="auth-tagline">நம்ம நாடு — Citizen Governance Platform</p>
          </div>

          <div className="complaint-success">
            <span className="complaint-success-icon" aria-hidden="true">✓</span>
            <h2>{success.message}</h2>
            <p>Your complaint has been received for review.</p>
            {success.trackingId && (
              <p className="complaint-tracking-result">
                Tracking ID: <strong>{success.trackingId}</strong>
              </p>
            )}
          </div>

          <div className="complaint-success-actions">
            <Link to="/citizen/dashboard" className="auth-btn complaint-action-primary">
              View My Complaints
            </Link>
            <Link to="/citizen/dashboard" className="auth-back">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page complaint-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <span className="auth-logo">N</span>
          <h1>NAMMANADU</h1>
          <p className="auth-tagline">நம்ம நாடு — File a Citizen Complaint</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form complaint-form" noValidate>
          <div className="complaint-form-heading">
            <div>
              <p className="complaint-form-eyebrow">Citizen services</p>
              <h2>File a Complaint</h2>
            </div>
            <Link to="/citizen/dashboard" className="complaint-dashboard-link">
              My Complaints
            </Link>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="complaint-title">Complaint Title *</label>
            <input
              id="complaint-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Briefly describe the issue"
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="complaint-description">Description *</label>
            <textarea
              id="complaint-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain what happened, where it happened, and how it affects the community."
              maxLength={2000}
              rows={6}
              required
            />
            <span className="complaint-character-count">{form.description.length}/2000</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="complaint-category">Category *</label>
              <select
                id="complaint-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="complaint-priority">Priority</label>
              <select
                id="complaint-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="complaint-district">District *</label>
              <input
                id="complaint-district"
                name="district"
                type="text"
                value={form.district}
                onChange={handleChange}
                placeholder="Your district"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="complaint-constituency">Constituency</label>
              <input
                id="complaint-constituency"
                name="constituency"
                type="text"
                value={form.constituency}
                onChange={handleChange}
                placeholder="Your constituency"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="complaint-address">Specific Address or Landmark</label>
            <input
              id="complaint-address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, locality, or nearby landmark"
            />
          </div>

          <p className="complaint-form-note">
            Your complaint will be linked to your citizen account and assigned a tracking ID after submission.
          </p>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Submitting Complaint..." : "Submit Complaint"}
          </button>
        </form>

        <Link to="/citizen/dashboard" className="auth-back">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
