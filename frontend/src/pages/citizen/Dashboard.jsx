import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Dashboard.css";

const STATUS_LABELS = {
  submitted: "Submitted",
  under_review: "Under Review",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const STATUS_FILTER_OPTIONS = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

const STATUS_FLOW = ["submitted", "assigned", "in_progress", "resolved"];
const PAGE_SIZE = 10;

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  pages: 0,
  limit: PAGE_SIZE,
};

const DEFAULT_STATISTICS = {
  total: 0,
  submitted: 0,
  inProgress: 0,
  resolved: 0,
};

const ICON_PATHS = {
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  landmark: (
    <>
      <path d="m3 10 9-6 9 6" />
      <path d="M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M3 18h18M2 21h20" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17 15 12 10 7" />
      <path d="M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" />
    </>
  ),
  mapPin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  message: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3-.6L4 20l1.7-4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.7-3L3 11" />
      <path d="M3 5v6h6M4 13a8 8 0 0 0 14.7 3L21 13" />
      <path d="M21 19v-6h-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.2 4.8L6 9l4.8 1.2L12 15l1.2-4.8L18 9l-4.8-1.2L12 3Z" />
      <path d="m19 14-.6 2.4L16 17l2.4.6L19 20l.6-2.4L22 17l-2.4-.6L19 14ZM5 14l-.5 2L3 16.5l1.5.5.5 2 .5-2 1.5-.5-1.5-.5L5 14Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
};

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  return (
    <svg
      aria-hidden="true"
      className="dashboard-icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

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

const formatDate = (date, options = {}) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
};

const formatDateTime = (date) => {
  if (!date) return "Not updated";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not updated";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase().trim();

  if (normalized === "resolved") return "status-resolved";
  if (normalized === "rejected") return "status-rejected";
  if (
    normalized === "under_review" ||
    normalized === "assigned" ||
    normalized === "in_progress"
  ) {
    return "status-progress";
  }

  return "status-submitted";
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getInitials = (name) => {
  const initials = String(name || "Citizen")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "C";
};

function StatCard({ label, value, icon, tone, detail }) {
  return (
    <article className={`dashboard-stat-card dashboard-stat-card--${tone}`}>
      <div className="stat-card-topline">
        <span className="stat-card-icon"><Icon name={icon} size={18} /></span>
        <span className="stat-card-detail">{detail}</span>
      </div>
      <p className="stat-card-label">{label}</p>
      <p className="stat-number">{value}</p>
    </article>
  );
}

function QuickAction({ icon, label, description, to, tone = "gold", disabled = false }) {
  const content = (
    <>
      <span className={`quick-action-icon quick-action-icon--${tone}`}>
        <Icon name={icon} size={20} />
      </span>
      <span className="quick-action-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <Icon name="arrowUpRight" size={17} />
    </>
  );

  if (disabled) {
    return (
      <div className="quick-action quick-action--disabled" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <a className="quick-action" href={to}>
      {content}
    </a>
  );
}

function ComplaintStatusRail({ complaint }) {
  const status = String(complaint?.status || "submitted").toLowerCase();
  const statusIndex = STATUS_FLOW.indexOf(status);
  const currentIndex = status === "under_review" ? 0 : statusIndex;
  const isRejected = status === "rejected";

  if (!complaint) {
    return (
      <div className="status-empty">
        <span className="status-empty-icon"><Icon name="clock" size={20} /></span>
        <div>
          <strong>Your complaint journey will appear here</strong>
          <p>Submit a complaint to see its real-time status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`status-rail${isRejected ? " status-rail--rejected" : ""}`}>
      <div className="status-rail-header">
        <div>
          <p className="section-eyebrow">Latest visible complaint</p>
          <h3>{complaint.tracking_id || "Tracking ID unavailable"}</h3>
        </div>
        <span className={`complaint-status ${getStatusClass(status)}`}>
          {formatStatus(status)}
        </span>
      </div>

      {isRejected ? (
        <div className="status-decision">
          <span className="status-decision-icon"><Icon name="shield" size={19} /></span>
          <div>
            <strong>This complaint was rejected</strong>
            <p>The status shown above reflects the latest update from the authority.</p>
          </div>
        </div>
      ) : (
        <ol className="status-rail-steps" aria-label="Complaint status progression">
          {STATUS_FLOW.map((step, index) => {
            const isComplete = currentIndex >= index;
            const isCurrent = status === step || (status === "under_review" && step === "submitted");

            return (
              <li key={step} className={isComplete ? "is-complete" : ""}>
                <span className={`status-rail-marker${isCurrent ? " is-current" : ""}`}>
                  {isComplete ? <Icon name="check" size={14} strokeWidth={2.3} /> : index + 1}
                </span>
                <span className="status-rail-label">{formatStatus(step)}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="status-rail-footer">
        <span><Icon name="calendar" size={14} /> Submitted {formatDate(complaint.createdAt)}</span>
        <span><Icon name="clock" size={14} /> Updated {formatDateTime(complaint.updatedAt)}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [stats, setStats] = useState(DEFAULT_STATISTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchDebouncing, setIsSearchDebouncing] = useState(false);
  const [page, setPage] = useState(1);
  const activeRequestRef = useRef(null);

  const displayName = user?.full_name || "Citizen";

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setIsSearchDebouncing(false);
    }, 300);

    return () => window.clearTimeout(requestId);
  }, [searchTerm]);

  const fetchComplaints = useCallback(async () => {
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints", {
        signal: controller.signal,
        params: {
          page,
          limit: PAGE_SIZE,
          search: debouncedSearchTerm,
          status: statusFilter,
          category: categoryFilter,
        },
      });

      const responseData = response?.data?.data || {};
      const complaintList = Array.isArray(responseData.complaints)
        ? responseData.complaints
        : [];
      const nextPagination = responseData.pagination || DEFAULT_PAGINATION;
      const nextStatistics = responseData.statistics || DEFAULT_STATISTICS;
      const resolvedPage = Number(nextPagination.page) || page;
      const resolvedPages = Number(nextPagination.pages) || 0;

      setComplaints(complaintList);
      setPagination({
        total: Number(nextPagination.total) || 0,
        page: resolvedPage,
        pages: resolvedPages,
        limit: Number(nextPagination.limit) || PAGE_SIZE,
      });
      if (resolvedPage !== page) setPage(resolvedPage);

      setCategories(
        Array.isArray(responseData.categories)
          ? responseData.categories.filter(Boolean)
          : []
      );
      setStats({
        total: Number(nextStatistics.total) || 0,
        submitted: Number(nextStatistics.submitted) || 0,
        inProgress: Number(nextStatistics.inProgress) || 0,
        resolved: Number(nextStatistics.resolved) || 0,
      });
    } catch (requestError) {
      if (requestError?.code === "ERR_CANCELED" || requestError?.name === "CanceledError") {
        return;
      }

      console.error("Failed to fetch complaints:", requestError);
      setComplaints([]);
      setPagination(DEFAULT_PAGINATION);
      setError(
        requestError?.response?.data?.message ||
          "Unable to load your complaints. Please try again."
      );
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setLoading(false);
      }
    }
  }, [categoryFilter, debouncedSearchTerm, page, statusFilter]);

  useEffect(() => {
    if (isSearchDebouncing) return undefined;

    const requestId = window.setTimeout(() => {
      fetchComplaints();
    }, 0);

    return () => {
      window.clearTimeout(requestId);
      activeRequestRef.current?.abort();
    };
  }, [fetchComplaints, isSearchDebouncing]);

  useEffect(() => () => activeRequestRef.current?.abort(), []);

  const normalizedSearchTerm = searchTerm.trim();
  const hasActiveFilters = Boolean(normalizedSearchTerm || statusFilter || categoryFilter);

  const updateSearchTerm = (value) => {
    setSearchTerm(value);
    setIsSearchDebouncing(true);
    setPage(1);
  };

  const updateStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const updateCategoryFilter = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setIsSearchDebouncing(true);
    setPage(1);
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages || nextPage === page) return;
    setPage(nextPage);
  };

  return (
    <div className="dashboard-page" id="top">
      <header className="dashboard-topbar">
        <div className="dashboard-topbar__inner">
          <Link to="/citizen/dashboard" className="dashboard-brand" aria-label="NAMMANADU dashboard">
            <span className="dashboard-brand__mark">N</span>
            <span className="dashboard-brand__copy">
              <strong>NAMMANADU</strong>
              <small>Citizen portal</small>
            </span>
          </Link>

          <nav className="dashboard-nav" aria-label="Citizen dashboard navigation">
            <a className="dashboard-nav__link dashboard-nav__link--active" href="#top">Dashboard</a>
            <a className="dashboard-nav__link" href="#complaints">My Complaints</a>
            <a className="dashboard-nav__link" href="#schemes">Government Schemes</a>
            <a className="dashboard-nav__link" href="#ai-assistant">AI Assistant</a>
          </nav>

          <div className="dashboard-topbar__actions">
            <button
              type="button"
              className="dashboard-utility dashboard-utility--disabled"
              disabled
              title="Notifications will appear here when the notification service is connected."
            >
              <Icon name="bell" size={17} />
              <span>Notifications</span>
            </button>
            <a href="#profile" className="dashboard-account" aria-label="Open your profile summary">
              <span className="dashboard-account__avatar">{getInitials(displayName)}</span>
              <span className="dashboard-account__copy">
                <strong>{displayName}</strong>
                <small>Citizen</small>
              </span>
            </a>
            <button type="button" onClick={logout} className="dashboard-logout" title="Log out">
              <Icon name="logout" size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div className="dashboard-hero__content">
            <div className="dashboard-hero__eyebrow"><span className="dashboard-live-dot" /> Tamil Nadu citizen portal</div>
            <h1>{getGreeting()}, <span>{displayName}</span> <span aria-hidden="true">👋</span></h1>
            <p className="dashboard-hero__lede">Stay informed. Speak up. Make Tamil Nadu better.</p>
            <p className="dashboard-hero__supporting">
              One place to raise civic concerns, follow their progress, and stay connected to the services that matter in your community.
            </p>
            <div className="dashboard-hero__actions">
              <Link to="/citizen/complaints/new" className="dashboard-button dashboard-button--primary">
                <Icon name="plus" size={17} />
                File a Complaint
              </Link>
              <a href="#ai-assistant" className="dashboard-button dashboard-button--secondary">
                AI Complaint Assistant
                <Icon name="arrowUpRight" size={16} />
              </a>
            </div>
          </div>

          <div className="dashboard-hero__aside" aria-label="Citizen account context">
            <div className="dashboard-hero__aside-top">
              <span className="dashboard-hero__aside-label">Your civic workspace</span>
              <span className="dashboard-hero__aside-icon"><Icon name="shield" size={19} /></span>
            </div>
            <strong>{user?.district || "Tamil Nadu"}</strong>
            <span>{user?.constituency || "Your local area"}</span>
            <div className="dashboard-hero__aside-line" />
            <p>Every well-documented complaint helps build a clearer picture of local needs.</p>
          </div>
        </section>

        <section className="dashboard-section dashboard-section--quick-actions" aria-labelledby="quick-actions-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="section-eyebrow">Start here</p>
              <h2 id="quick-actions-title">What would you like to do?</h2>
            </div>
            <span className="dashboard-section-heading__hint">Citizen services</span>
          </div>
          <div className="quick-actions-grid">
            <QuickAction
              icon="file"
              label="File a Complaint"
              description="Report a civic issue"
              to="/citizen/complaints/new"
              tone="gold"
            />
            <QuickAction
              icon="sparkles"
              label="AI Complaint Assistant"
              description="Preparation service coming soon"
              to="#ai-assistant"
              tone="violet"
            />
            <QuickAction
              icon="landmark"
              label="Government Schemes"
              description="Explore eligibility support"
              to="#schemes"
              tone="blue"
            />
            <QuickAction
              icon="search"
              label="Track Complaint"
              description="Follow your latest update"
              to="#complaints"
              tone="green"
            />
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="overview-title">
          <div className="dashboard-section-heading">
            <div>
              <p className="section-eyebrow">Your overview</p>
              <h2 id="overview-title">Civic activity at a glance</h2>
            </div>
            <span className="dashboard-data-note"><span className="dashboard-live-dot" /> Live from your account</span>
          </div>
          <div className="dashboard-stats-grid">
            <StatCard label="Total Complaints" value={stats.total} icon="file" tone="gold" detail="All time" />
            <StatCard label="Submitted" value={stats.submitted} icon="clock" tone="blue" detail="Awaiting review" />
            <StatCard label="In Progress" value={stats.inProgress} icon="refresh" tone="violet" detail="Being handled" />
            <StatCard label="Resolved" value={stats.resolved} icon="check" tone="green" detail="Closed successfully" />
          </div>
        </section>

        <section className="dashboard-content-grid">
          <section className="recent-complaints-panel" id="complaints" aria-labelledby="recent-complaints-title">
            <div className="dashboard-section-heading dashboard-section-heading--panel">
              <div>
                <p className="section-eyebrow">Your reports</p>
                <h2 id="recent-complaints-title">Recent complaints</h2>
                <p className="section-subtitle">Track the concerns you have raised with NAMMANADU.</p>
              </div>
              <Link to="/citizen/complaints/new" className="text-action">
                New complaint <Icon name="arrowUpRight" size={15} />
              </Link>
            </div>

            {!loading && !error && stats.total > 0 && (
              <div className="complaint-filters" aria-label="Search and filter complaints">
                <div className="complaint-search-field">
                  <label htmlFor="complaint-search">Search complaints</label>
                  <div className="dashboard-input-wrap">
                    <Icon name="search" size={16} />
                    <input
                      id="complaint-search"
                      type="search"
                      value={searchTerm}
                      onChange={(event) => updateSearchTerm(event.target.value)}
                      placeholder="Tracking ID, title, or category"
                    />
                  </div>
                </div>

                <div className="complaint-filter-field">
                  <label htmlFor="complaint-status-filter">Status</label>
                  <select
                    id="complaint-status-filter"
                    value={statusFilter}
                    onChange={(event) => updateStatusFilter(event.target.value)}
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
                    onChange={(event) => updateCategoryFilter(event.target.value)}
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
              <div className="dashboard-state dashboard-state--panel" role="status" aria-live="polite">
                <span className="state-loader" />
                <p>Loading your complaints...</p>
              </div>
            )}

            {!loading && error && (
              <div className="dashboard-state dashboard-error dashboard-state--panel" role="alert">
                <span className="state-icon"><Icon name="refresh" size={19} /></span>
                <p>{error}</p>
                <button type="button" onClick={fetchComplaints} className="dashboard-button dashboard-button--small">
                  <Icon name="refresh" size={15} /> Try Again
                </button>
              </div>
            )}

            {!loading && !error && stats.total === 0 && (
              <div className="dashboard-state dashboard-empty dashboard-state--panel">
                <span className="state-icon state-icon--gold"><Icon name="file" size={21} /></span>
                <h3>Make your first report</h3>
                <p>You have not submitted any civic complaints yet. Start by telling us what needs attention.</p>
                <Link to="/citizen/complaints/new" className="dashboard-button dashboard-button--small dashboard-button--primary">
                  <Icon name="plus" size={15} /> File Your First Complaint
                </Link>
              </div>
            )}

            {!loading && !error && hasActiveFilters && pagination.total === 0 && (
              <div className="dashboard-state dashboard-empty dashboard-state--panel">
                <span className="state-icon"><Icon name="search" size={20} /></span>
                <h3>No matching complaints</h3>
                <p>Try adjusting your search or filters.</p>
                <button type="button" className="dashboard-button dashboard-button--small" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && complaints.length > 0 && (
              <div className="complaints-list">
                {complaints.map((complaint) => {
                  const title = complaint.title || complaint.complaint_title || "Untitled Complaint";
                  const status = complaint.status || complaint.complaint_status || "submitted";
                  const createdAt = complaint.createdAt || complaint.created_at;
                  const updatedAt = complaint.updatedAt || complaint.updated_at;

                  return (
                    <article key={complaint._id || complaint.tracking_id} className="complaint-card">
                      <div className="complaint-card-header">
                        <div className="complaint-card-heading">
                          {complaint._id ? (
                            <Link to={`/citizen/complaints/${complaint._id}`} className="complaint-tracking-link">
                              {complaint.tracking_id || "View complaint details"}
                            </Link>
                          ) : (
                            <span className="complaint-tracking-id">{complaint.tracking_id || "No tracking ID"}</span>
                          )}
                          <h3>{title}</h3>
                        </div>
                        <span className={`complaint-status ${getStatusClass(status)}`}>{formatStatus(status)}</span>
                      </div>

                      {complaint.description && <p className="complaint-description">{complaint.description}</p>}

                      <div className="complaint-meta">
                        <div><span>Category</span><strong>{formatCategory(complaint.category)}</strong></div>
                        <div><span>District</span><strong>{complaint.district || "Not specified"}</strong></div>
                        <div><span>Priority</span><strong>{formatCategory(complaint.priority || "medium")}</strong></div>
                      </div>

                      <div className="complaint-card-footer">
                        <div className="complaint-dates">
                          <span><Icon name="calendar" size={14} /> Submitted {formatDate(createdAt)}</span>
                          <span><Icon name="clock" size={14} /> Updated {formatDateTime(updatedAt)}</span>
                        </div>
                        {complaint._id && (
                          <Link to={`/citizen/complaints/${complaint._id}`} className="complaint-view-link">
                            View Details <Icon name="chevronRight" size={15} />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && !error && pagination.pages > 1 && (
              <nav className="complaint-pagination" aria-label="Complaint pages">
                <span className="complaint-pagination-summary">
                  Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div className="complaint-pagination-actions">
                  <button type="button" className="complaint-pagination-button" onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1 || loading}>
                    Previous
                  </button>
                  <span className="complaint-pagination-page">Page {pagination.page} of {pagination.pages}</span>
                  <button type="button" className="complaint-pagination-button" onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.pages || loading}>
                    Next
                  </button>
                </div>
              </nav>
            )}
          </section>

          <aside className="dashboard-side-stack">
            <section className="status-panel" aria-labelledby="status-title">
              <div className="dashboard-section-heading dashboard-section-heading--compact">
                <div>
                  <p className="section-eyebrow">Live status</p>
                  <h2 id="status-title">Complaint progress</h2>
                </div>
                <span className="panel-icon"><Icon name="refresh" size={17} /></span>
              </div>
              <ComplaintStatusRail complaint={complaints[0]} />
            </section>

            <section className="dashboard-profile-card" id="profile" aria-labelledby="profile-title">
              <div className="dashboard-profile-card__top">
                <span className="dashboard-profile-card__avatar">{getInitials(displayName)}</span>
                <div>
                  <p className="section-eyebrow">Your profile</p>
                  <h2 id="profile-title">{displayName}</h2>
                </div>
              </div>
              <div className="dashboard-profile-card__details">
                <span><Icon name="user" size={14} /> Citizen account</span>
                {user?.district && <span><Icon name="mapPin" size={14} /> {user.district}</span>}
                {user?.email && <span><Icon name="message" size={14} /> {user.email}</span>}
              </div>
              <p className="dashboard-profile-card__note">Your account keeps your complaints and updates together in one place.</p>
            </section>
          </aside>
        </section>

        <section className="dashboard-feature-grid">
          <section className="feature-panel feature-panel--ai" id="ai-assistant" aria-labelledby="ai-title">
            <div className="feature-panel__icon"><Icon name="sparkles" size={22} /></div>
            <div className="feature-panel__content">
              <p className="section-eyebrow">Coming next</p>
              <h2 id="ai-title">Need help reporting an issue?</h2>
              <p>Describe your civic problem and NAMMANADU AI can help turn it into a clear complaint.</p>
              <div className="feature-panel__actions">
                <button type="button" className="dashboard-button dashboard-button--small" disabled title="AI Assistant is not connected yet.">
                  <Icon name="sparkles" size={15} /> Start with AI
                </button>
                <Link to="/citizen/complaints/new" className="feature-text-link">Open complaint form instead <Icon name="arrowUpRight" size={14} /></Link>
              </div>
            </div>
            <span className="feature-status">In preparation</span>
          </section>

          <section className="feature-panel feature-panel--schemes" id="schemes" aria-labelledby="schemes-title">
            <div className="feature-panel__icon"><Icon name="landmark" size={22} /></div>
            <div className="feature-panel__content">
              <p className="section-eyebrow">Public services</p>
              <h2 id="schemes-title">Government schemes</h2>
              <p>Eligibility guidance will be available here once the schemes data service is connected.</p>
              <button type="button" className="dashboard-button dashboard-button--small" disabled title="Government scheme data is not connected yet.">
                <Icon name="landmark" size={15} /> Check Eligibility
              </button>
            </div>
            <span className="feature-status">Data service pending</span>
          </section>
        </section>

        <section className="civic-impact-card" aria-labelledby="impact-title">
          <div className="civic-impact-card__icon"><Icon name="shield" size={22} /></div>
          <div className="civic-impact-card__copy">
            <p className="section-eyebrow">Civic impact</p>
            <h2 id="impact-title">Your participation matters</h2>
            <p>Every thoughtful report helps make local needs more visible and actionable.</p>
          </div>
          <div className="civic-impact-card__points">
            <span>Reward points</span>
            <strong>{user?.reward_points ?? 0}</strong>
          </div>
        </section>
      </main>
    </div>
  );
}
