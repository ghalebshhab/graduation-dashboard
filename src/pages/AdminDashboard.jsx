import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBan,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaNewspaper,
} from "react-icons/fa";

import {
  getAdminStats,
  getAdminUsers,
  blockUser,
  unblockUser,
  getPendingPlaces,
  getAllPlaces,
  approvePlace,
  rejectPlace,
  deactivatePlace,
  getAdminPosts,
  deletePostByAdmin,
  getReports,
  resolveReport,
} from "../api/adminApi";

import "../Styles/admin-dashboard1.css";

export default function AdminDashboard({onLogout}) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [
        statsRes,
        usersRes,
        pendingPlacesRes,
        allPlacesRes,
        postsRes,
        reportsRes,
      ] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getPendingPlaces(),
        getAllPlaces(),
        getAdminPosts(),
        getReports(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (pendingPlacesRes.success) setPendingPlaces(pendingPlacesRes.data);
      if (allPlacesRes.success) setAllPlaces(allPlacesRes.data);
      if (postsRes.success) setPosts(postsRes.data);
      if (reportsRes.success) setReports(reportsRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load dashboard data. Check your token or backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApprovePlace = async (placeId) => {
    const res = await approvePlace(placeId);

    if (res.success) {
      alert("Place approved successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleRejectPlace = async (placeId) => {
    const res = await rejectPlace(placeId);

    if (res.success) {
      alert("Place rejected successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleDeactivatePlace = async (placeId) => {
    const res = await deactivatePlace(placeId);

    if (res.success) {
      alert("Place deactivated successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleBlockUser = async (userId, active) => {
    const res = active ? await blockUser(userId) : await unblockUser(userId);

    if (res.success) {
      alert(res.message);
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const res = await deletePostByAdmin(postId);

    if (res.success) {
      alert("Post deleted successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleResolveReport = async (reportId) => {
    const res = await resolveReport(reportId);

    if (res.success) {
      alert("Report resolved successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const showSection = (section) => {
    setActiveSection(section);
  };

  if (loading) {
    return (
      <div className="layout">
        <main className="main">
          <h1>Loading dashboard...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="../../public/OurLogo.png" alt="JoMap Logo" />
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => showSection("dashboard")}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => showSection("users")}
          >
            <FaUsers />
            <span>Users</span>
          </button>

          <button
            className={`nav-item ${activeSection === "locations" ? "active" : ""}`}
            onClick={() => showSection("locations")}
          >
            <FaMapMarkerAlt />
            <span>Locations</span>
          </button>

          <button
            className={`nav-item ${activeSection === "posts" ? "active" : ""}`}
            onClick={() => showSection("posts")}
          >
            <FaNewspaper />
            <span>Posts</span>
          </button>

          <button
            className={`nav-item ${activeSection === "events" ? "active" : ""}`}
            onClick={() => showSection("events")}
          >
            <FaCalendarAlt />
            <span>Events</span>
          </button>

          <button
            className={`nav-item ${activeSection === "reports" ? "active" : ""}`}
            onClick={() => showSection("reports")}
          >
            <FaExclamationTriangle />
            <span>Reports</span>
          </button>
          <button className="nav-item logout-item" onClick={onLogout}>
  <span>Logout</span>
</button>
        </nav>
      </aside>

      <main className="main">
        {activeSection === "dashboard" && (
          <section className="section active">
            <header>
              <h1>System Overview</h1>
              <span className="subtitle">
                Welcome Admin. Real-time JoMap statistics.
              </span>
            </header>

            <div className="stats-grid">
              <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
              <StatCard
                title="Active Users"
                value={stats?.activeUsers ?? 0}
                color="success"
              />
              <StatCard
                title="Blocked Users"
                value={stats?.blockedUsers ?? 0}
                color="danger"
              />
              <StatCard
                title="Total Locations"
                value={stats?.totalPlaces ?? 0}
              />
              <StatCard
                title="Approved Locations"
                value={stats?.approvedPlaces ?? 0}
                color="secondary"
              />
              <StatCard
                title="Pending Locations"
                value={stats?.pendingPlaces ?? 0}
                color="warning"
              />
              <StatCard title="Total Posts" value={stats?.totalPosts ?? 0} />
              <StatCard
                title="Deleted Posts"
                value={stats?.deletedPosts ?? 0}
                color="warning"
              />
              <StatCard
                title="Pending Reports"
                value={stats?.pendingReports ?? 0}
                color="danger"
              />
            </div>

            <div className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3>System Distribution</h3>
                </div>

                <ProgressRow
                  label="Approved Locations"
                  value={percentage(stats?.approvedPlaces, stats?.totalPlaces)}
                />
                <ProgressRow
                  label="Pending Locations"
                  value={percentage(stats?.pendingPlaces, stats?.totalPlaces)}
                />
                <ProgressRow
                  label="Active Users"
                  value={percentage(stats?.activeUsers, stats?.totalUsers)}
                />
                <ProgressRow
                  label="Deleted Posts"
                  value={percentage(stats?.deletedPosts, stats?.totalPosts)}
                />
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Status</h3>
                </div>

                <ProgressRow
                  label="Clean Content"
                  value={Math.max(
                    0,
                    100 - percentage(stats?.deletedPosts, stats?.totalPosts),
                  )}
                />
                <ProgressRow
                  label="Reports Pending"
                  value={percentage(stats?.pendingReports, stats?.totalReports)}
                />
                <ProgressRow
                  label="Blocked Users"
                  value={percentage(stats?.blockedUsers, stats?.totalUsers)}
                />
              </div>
            </div>
          </section>
        )}

        {activeSection === "users" && (
          <section className="section active">
            <header>
              <h1>User Management</h1>
              <span className="subtitle">
                Monitor and manage user accounts.
              </span>
            </header>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <EmptyRow colSpan={5} text="No users found" />
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <StatusBadge
                            text={user.active ? "Active" : "Blocked"}
                            type={user.active ? "success" : "danger"}
                          />
                        </td>
                        <td>
                          <button
                            className={
                              user.active ? "btn btn-danger" : "btn btn-action"
                            }
                            onClick={() =>
                              handleBlockUser(user.id, user.active)
                            }
                          >
                            <FaBan />
                            {user.active ? "Block" : "Unblock"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "locations" && (
          <section className="section active">
            <header>
              <h1>Location Management</h1>
              <span className="subtitle">
                Approve, reject, or deactivate owner locations.
              </span>
            </header>

            <h2>Pending Locations</h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Governorate</th>
                    <th>Category</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingPlaces.length === 0 ? (
                    <EmptyRow colSpan={7} text="No pending locations" />
                  ) : (
                    pendingPlaces.map((place) => (
                      <tr key={place.id}>
                        <td>
                          <img
                            className="table-img"
                            src={place.imageUrl}
                            alt={place.name}
                          />
                        </td>
                        <td>{place.name}</td>
                        <td>{place.governorate}</td>
                        <td>{place.category}</td>
                        <td>{place.ownerName}</td>
                        <td>
                          <StatusBadge text="Pending" type="warning" />
                        </td>
                        <td>
                          <button
                            className="btn btn-action"
                            onClick={() => handleApprovePlace(place.id)}
                          >
                            <FaCheck /> Approve
                          </button>

                          <button
                            className="btn btn-danger margin-left"
                            onClick={() => handleRejectPlace(place.id)}
                          >
                            <FaTimes /> Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="section-title">All Locations</h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Governorate</th>
                    <th>Category</th>
                    <th>Approved</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {allPlaces.length === 0 ? (
                    <EmptyRow colSpan={6} text="No locations found" />
                  ) : (
                    allPlaces.map((place) => (
                      <tr key={place.id}>
                        <td>{place.name}</td>
                        <td>{place.governorate}</td>
                        <td>{place.category}</td>
                        <td>
                          <StatusBadge
                            text={place.approved ? "Approved" : "Pending"}
                            type={place.approved ? "success" : "warning"}
                          />
                        </td>
                        <td>
                          <StatusBadge
                            text={place.active ? "Active" : "Inactive"}
                            type={place.active ? "success" : "danger"}
                          />
                        </td>
                        <td>
                          {place.active && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeactivatePlace(place.id)}
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "posts" && (
          <section className="section active">
            <header>
              <h1>Post Management</h1>
              <span className="subtitle">
                Monitor and remove community posts.
              </span>
            </header>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Content</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.length === 0 ? (
                    <EmptyRow colSpan={5} text="No posts found" />
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.authorName}</td>
                        <td>{post.content}</td>
                        <td>{post.type}</td>
                        <td>
                          <StatusBadge
                            text={post.deleted ? "Deleted" : "Active"}
                            type={post.deleted ? "danger" : "success"}
                          />
                        </td>
                        <td>
                          {!post.deleted && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "events" && (
          <section className="section active">
            <header>
              <h1>Event Moderation</h1>
              <span className="subtitle">
                This UI is ready. Backend events module can be added later.
              </span>
            </header>

            <div className="coming-soon">
              <h2>Events Coming Soon</h2>
              <p>
                Keep this section as UI only until you create Event entity and
                admin event APIs.
              </p>
            </div>
          </section>
        )}

        {activeSection === "reports" && (
          <section className="section active">
            <header>
              <h1>Reports & Complaints</h1>
              <span className="subtitle">Resolve user-submitted issues.</span>
            </header>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Reported By</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.length === 0 ? (
                    <EmptyRow colSpan={5} text="No reports found" />
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id}>
                        <td>#{report.id}</td>
                        <td>{report.reportedBy}</td>
                        <td>{report.reason}</td>
                        <td>
                          <StatusBadge
                            text={report.resolved ? "Resolved" : "Open"}
                            type={report.resolved ? "success" : "danger"}
                          />
                        </td>
                        <td>
                          {!report.resolved ? (
                            <button
                              className="btn btn-action"
                              onClick={() => handleResolveReport(report.id)}
                            >
                              Resolve
                            </button>
                          ) : (
                            <button className="btn btn-disabled">Closed</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className={`value ${color ? `text-${color}` : ""}`}>
        {Number(value).toLocaleString()}
      </div>
    </div>
  );
}

function ProgressRow({ label, value }) {
  const safeValue = Number.isFinite(value) ? value : 0;

  return (
    <div className="chart-row">
      <div className="chart-label">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ text, type }) {
  return <span className={`badge badge-${type}`}>{text}</span>;
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-cell">
        {text}
      </td>
    </tr>
  );
}

function percentage(part, total) {
  if (!total || total === 0) return 0;
  return Math.round((Number(part || 0) / Number(total)) * 100);
}
