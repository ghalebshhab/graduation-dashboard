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
  FaClock,
  FaFire,
  FaListAlt,
  FaCalendarCheck,
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
  getAdminEvents,
  approveEvent,
  rejectEvent,
} from "../api/adminApi";

import "../Styles/admin-dashboard1.css";

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsFilter, setEventsFilter] = useState("ALL");

  const [rejectLocation, setRejectLocation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  const safeRequest = async (requestFunction, fallbackData = []) => {
    try {
      const response = await requestFunction();
      if (response?.success) return response.data ?? fallbackData;
      if (Array.isArray(response)) return response;
      return fallbackData;
    } catch (error) {
      console.error("API request failed:", error?.response || error);
      return fallbackData;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, pendingPlacesData, allPlacesData, postsData, reportsData, eventsData] = await Promise.all([
        safeRequest(getAdminStats, null),
        safeRequest(getAdminUsers, []),
        safeRequest(getPendingPlaces, []),
        safeRequest(getAllPlaces, []),
        safeRequest(getAdminPosts, []),
        safeRequest(getReports, []),
        safeRequest(getAdminEvents, []),
      ]);

      setStats(statsData);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setPendingPlaces(Array.isArray(pendingPlacesData) ? pendingPlacesData : []);
      setAllPlaces(Array.isArray(allPlacesData) ? allPlacesData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
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

  const eventStats = {
    totalEvents: events.length,
    pendingEvents: events.filter((event) => event.status === "PENDING").length,
    approvedEvents: events.filter((event) => event.status === "APPROVED").length,
    rejectedEvents: events.filter((event) => event.status === "REJECTED").length,
    activeEvents: events.filter((event) => event.status === "APPROVED").length,
    upcomingEvents: events.filter((event) => {
      if (!event.date || event.status !== "APPROVED") return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).length,
  };

  const filteredEvents = eventsFilter === "ALL" ? events : events.filter((event) => event.status === eventsFilter);
  const latestEvents = [...events].sort((a, b) => Number(b.id || 0) - Number(a.id || 0)).slice(0, 5);

  const handleApprovePlace = async (placeId) => {
    const res = await approvePlace(placeId);
    if (res.success) {
      alert("Place approved successfully");
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const openRejectCard = (place) => {
    setRejectLocation(place);
    setRejectReason("");
    setRejectError("");
  };

  const closeRejectCard = () => {
    if (rejectSubmitting) return;
    setRejectLocation(null);
    setRejectReason("");
    setRejectError("");
  };

  const submitRejectLocation = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      setRejectError("Please write the rejection reason before sending it to the owner.");
      return;
    }

    setRejectSubmitting(true);
    setRejectError("");
    const res = await rejectPlace(rejectLocation.id, reason);
    setRejectSubmitting(false);

    if (res.success) {
      alert("Place rejected successfully and the owner was notified.");
      closeRejectCard();
      loadDashboardData();
    } else {
      setRejectError(res.message || "Failed to reject location.");
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

  const handleApproveEvent = async (eventId) => {
    const res = await approveEvent(eventId);
    if (res.success) {
      alert("Event approved successfully");
      loadDashboardData();
    } else {
      alert(res.message || "Failed to approve event");
    }
  };

  const handleRejectEvent = async (eventId) => {
    const res = await rejectEvent(eventId);
    if (res.success) {
      alert("Event rejected successfully");
      loadDashboardData();
    } else {
      alert(res.message || "Failed to reject event");
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <main className="main"><h1>Loading dashboard...</h1></main>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-logo"><img src="/OurLogo.png" alt="JoMap Logo" /></div></div>
        <nav className="nav">
          <NavButton active={activeSection === "dashboard"} onClick={() => setActiveSection("dashboard")} icon={<FaChartLine />} text="Dashboard" />
          <NavButton active={activeSection === "users"} onClick={() => setActiveSection("users")} icon={<FaUsers />} text="Users" />
          <NavButton active={activeSection === "locations"} onClick={() => setActiveSection("locations")} icon={<FaMapMarkerAlt />} text="Locations" />
          <NavButton active={activeSection === "posts"} onClick={() => setActiveSection("posts")} icon={<FaNewspaper />} text="Posts" />
          <NavButton active={activeSection === "events"} onClick={() => setActiveSection("events")} icon={<FaCalendarAlt />} text="Events" />
          <NavButton active={activeSection === "reports"} onClick={() => setActiveSection("reports")} icon={<FaExclamationTriangle />} text="Reports" />
          <button className="nav-item logout-item" onClick={onLogout}>Logout</button>
        </nav>
      </aside>

      <main className="main">
        {activeSection === "dashboard" && (
          <section className="section active">
            <header><h1>System Overview</h1><span className="subtitle">Welcome Admin. Real-time JoMap statistics.</span></header>
            <div className="stats-grid">
              <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
              <StatCard title="Active Users" value={stats?.activeUsers ?? 0} color="success" />
              <StatCard title="Blocked Users" value={stats?.blockedUsers ?? 0} color="danger" />
              <StatCard title="Total Locations" value={stats?.totalPlaces ?? 0} />
              <StatCard title="Approved Locations" value={stats?.approvedPlaces ?? 0} color="secondary" />
              <StatCard title="Pending Locations" value={stats?.pendingPlaces ?? 0} color="warning" />
              <StatCard title="Total Posts" value={stats?.totalPosts ?? 0} />
              <StatCard title="Deleted Posts" value={stats?.deletedPosts ?? 0} color="warning" />
              <StatCard title="Pending Reports" value={stats?.pendingReports ?? 0} color="danger" />
              <StatCard title="Total Events" value={eventStats.totalEvents} color="secondary" />
              <StatCard title="Active Events" value={eventStats.activeEvents} color="success" />
              <StatCard title="Pending Events" value={eventStats.pendingEvents} color="warning" />
            </div>
            <div className="content-grid">
              <div className="panel">
                <div className="panel-header"><h3>System Distribution</h3></div>
                <ProgressRow label="Approved Locations" value={percentage(stats?.approvedPlaces, stats?.totalPlaces)} />
                <ProgressRow label="Pending Locations" value={percentage(stats?.pendingPlaces, stats?.totalPlaces)} />
                <ProgressRow label="Active Users" value={percentage(stats?.activeUsers, stats?.totalUsers)} />
                <ProgressRow label="Deleted Posts" value={percentage(stats?.deletedPosts, stats?.totalPosts)} />
              </div>
              <div className="panel">
                <div className="panel-header"><h3>Events Health</h3></div>
                <ProgressRow label="Approved Events" value={percentage(eventStats.approvedEvents, eventStats.totalEvents)} />
                <ProgressRow label="Pending Events" value={percentage(eventStats.pendingEvents, eventStats.totalEvents)} />
                <ProgressRow label="Rejected Events" value={percentage(eventStats.rejectedEvents, eventStats.totalEvents)} />
                <ProgressRow label="Upcoming Active Events" value={percentage(eventStats.upcomingEvents, eventStats.totalEvents)} />
              </div>
            </div>
            <div className="content-grid">
              <div className="panel">
                <div className="panel-header"><h3>Latest Events</h3><button className="btn btn-action" onClick={() => setActiveSection("events")}>Manage Events</button></div>
                {latestEvents.length === 0 ? <p className="muted-text">No events created yet.</p> : (
                  <div className="mini-event-list">
                    {latestEvents.map((event) => (
                      <div className="mini-event-card" key={event.id}>
                        <div className="mini-event-icon"><FaCalendarAlt /></div>
                        <div><h4>{event.title}</h4><p>{event.governorate || "Unknown governorate"} • {event.date || "No date"}</p></div>
                        <StatusBadge text={event.status} type={getBadgeType(event.status)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="panel">
                <div className="panel-header"><h3>Status</h3></div>
                <ProgressRow label="Clean Content" value={Math.max(0, 100 - percentage(stats?.deletedPosts, stats?.totalPosts))} />
                <ProgressRow label="Reports Pending" value={percentage(stats?.pendingReports, stats?.totalReports)} />
                <ProgressRow label="Blocked Users" value={percentage(stats?.blockedUsers, stats?.totalUsers)} />
              </div>
            </div>
          </section>
        )}

        {activeSection === "users" && (
          <section className="section active">
            <header><h1>User Management</h1><span className="subtitle">Monitor and manage user accounts.</span></header>
            <DataTable columns={["Username", "Email", "Role", "Status", "Action"]} emptyText="No users found" colSpan={5} rows={users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td><td>{user.email}</td><td>{user.role}</td>
                <td><StatusBadge text={user.active ? "Active" : "Blocked"} type={user.active ? "success" : "danger"} /></td>
                <td><button className={user.active ? "btn btn-danger" : "btn btn-action"} onClick={() => handleBlockUser(user.id, user.active)}><FaBan /> {user.active ? "Block" : "Unblock"}</button></td>
              </tr>
            ))} />
          </section>
        )}

        {activeSection === "locations" && (
          <section className="section active">
            <header><h1>Location Management</h1><span className="subtitle">Approve, reject, or deactivate owner locations.</span></header>
            <h2>Pending Locations</h2>
            <DataTable columns={["Image", "Name", "Governorate", "Category", "Owner", "Status", "Action"]} emptyText="No pending locations" colSpan={7} rows={pendingPlaces.map((place) => (
              <tr key={place.id}>
                <td>{place.imageUrl ? <img className="table-img" src={place.imageUrl} alt={place.name} /> : "—"}</td>
                <td>{place.name}</td><td>{place.governorate}</td><td>{place.category}</td><td>{place.ownerName}</td>
                <td><StatusBadge text="Pending" type="warning" /></td>
                <td><button className="btn btn-action" onClick={() => handleApprovePlace(place.id)}><FaCheck /> Approve</button><button className="btn btn-danger margin-left" onClick={() => openRejectCard(place)}><FaTimes /> Reject</button></td>
              </tr>
            ))} />
            <h2 className="section-title">All Locations</h2>
            <DataTable columns={["Name", "Governorate", "Category", "Status", "Active", "Action"]} emptyText="No locations found" colSpan={6} rows={allPlaces.map((place) => (
              <tr key={place.id}>
                <td>{place.name}</td><td>{place.governorate}</td><td>{place.category}</td>
                <td><StatusBadge text={place.status || (place.approved ? "Approved" : "Pending")} type={place.approved ? "success" : "warning"} /></td>
                <td><StatusBadge text={place.active ? "Active" : "Inactive"} type={place.active ? "success" : "danger"} /></td>
                <td>{place.active && <button className="btn btn-danger" onClick={() => handleDeactivatePlace(place.id)}>Deactivate</button>}</td>
              </tr>
            ))} />
          </section>
        )}

        {activeSection === "posts" && (
          <section className="section active">
            <header><h1>Post Management</h1><span className="subtitle">Monitor and remove community posts.</span></header>
            <DataTable columns={["Author", "Content", "Type", "Status", "Action"]} emptyText="No posts found" colSpan={5} rows={posts.map((post) => (
              <tr key={post.id}>
                <td>{post.authorName || "Unknown"}</td><td>{post.content}</td><td>{post.type}</td>
                <td><StatusBadge text={post.deleted ? "Deleted" : "Active"} type={post.deleted ? "danger" : "success"} /></td>
                <td>{!post.deleted && <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>}</td>
              </tr>
            ))} />
          </section>
        )}

        {activeSection === "events" && (
          <section className="section active">
            <header className="events-header"><div><h1>Event Command Center</h1><span className="subtitle">Review, approve, and manage JoMap events created by users.</span></div><button className="btn btn-action" onClick={loadDashboardData}>Refresh Events</button></header>
            <div className="events-hero"><div className="events-hero-content"><span className="events-kicker">JoMap Events Module</span><h2>Manage cultural, tourism, and community events in one place.</h2><p>Approve high-quality events, reject invalid submissions, and track upcoming activities across Jordan.</p></div><div className="events-hero-metrics"><div><strong>{eventStats.totalEvents}</strong><span>Total</span></div><div><strong>{eventStats.activeEvents}</strong><span>Active</span></div><div><strong>{eventStats.pendingEvents}</strong><span>Waiting</span></div></div></div>
            <div className="events-stats-grid"><EventInfoCard icon={<FaListAlt />} title="Total Events" value={eventStats.totalEvents} description="All events submitted by users" /><EventInfoCard icon={<FaCalendarCheck />} title="Active Events" value={eventStats.activeEvents} description="Approved events visible to users" type="success" /><EventInfoCard icon={<FaClock />} title="Pending Review" value={eventStats.pendingEvents} description="Events waiting for admin decision" type="warning" /><EventInfoCard icon={<FaFire />} title="Upcoming" value={eventStats.upcomingEvents} description="Approved events from today forward" type="secondary" /></div>
            <div className="events-toolbar"><div><h2>Events Queue</h2><p>Filter and moderate events before they appear in the JoMap application.</p></div><div className="filter-pills">{["ALL", "PENDING", "APPROVED", "REJECTED"].map((filter) => <button key={filter} className={`filter-pill ${eventsFilter === filter ? "active" : ""}`} onClick={() => setEventsFilter(filter)}>{filter}</button>)}</div></div>
            <div className="events-grid">
              {filteredEvents.length === 0 ? <div className="empty-events"><FaCalendarAlt /><h3>No events found</h3><p>No events match the selected filter.</p></div> : filteredEvents.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="event-image-wrap">{event.imageUrl ? <img src={event.imageUrl} alt={event.title} /> : <div className="event-image-placeholder"><FaCalendarAlt /></div>}<StatusBadge text={event.status} type={getBadgeType(event.status)} /></div>
                  <div className="event-card-body"><div className="event-meta"><span>{event.date || "No date"}</span><span>{event.time || "No time"}</span></div><h3>{event.title}</h3><p className="event-description">{event.description || "No description provided."}</p><div className="event-details"><div><strong>Location</strong><span>{event.locationName || "Not specified"}</span></div><div><strong>Governorate</strong><span>{event.governorate || "Not specified"}</span></div><div><strong>Created By</strong><span>{event.createdByUsername || "Unknown user"}</span></div></div><div className="event-actions">{event.status === "PENDING" ? <><button className="btn btn-action" onClick={() => handleApproveEvent(event.id)}><FaCheck /> Approve</button><button className="btn btn-danger" onClick={() => handleRejectEvent(event.id)}><FaTimes /> Reject</button></> : <button className="btn btn-disabled">Reviewed</button>}</div></div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "reports" && (
          <section className="section active">
            <header><h1>Reports & Complaints</h1><span className="subtitle">Resolve user-submitted issues.</span></header>
            <DataTable columns={["Report ID", "Reported By", "Reason", "Status", "Action"]} emptyText="No reports found" colSpan={5} rows={reports.map((report) => (
              <tr key={report.id}>
                <td>#{report.id}</td><td>{report.reportedBy}</td><td>{report.reason}</td><td><StatusBadge text={report.resolved ? "Resolved" : "Open"} type={report.resolved ? "success" : "danger"} /></td><td>{!report.resolved ? <button className="btn btn-action" onClick={() => handleResolveReport(report.id)}>Resolve</button> : <button className="btn btn-disabled">Closed</button>}</td>
              </tr>
            ))} />
          </section>
        )}
      </main>

      {rejectLocation && (
        <div style={rejectStyles.backdrop}>
          <div style={rejectStyles.card}>
            <button type="button" style={rejectStyles.closeButton} onClick={closeRejectCard} disabled={rejectSubmitting}><FaTimes /></button>
            <div style={rejectStyles.icon}><FaExclamationTriangle /></div>
            <p style={rejectStyles.kicker}>Admin decision required</p>
            <h2 style={rejectStyles.title}>Reject Location Request</h2>
            <p style={rejectStyles.description}>Write a clear reason for rejecting <strong>{rejectLocation.name}</strong>. This reason will be sent to the owner as an app notification.</p>
            <label style={rejectStyles.label}>Rejection reason</label>
            <textarea style={rejectStyles.textarea} value={rejectReason} onChange={(event) => { setRejectReason(event.target.value); setRejectError(""); }} placeholder="Example: Missing official contact number, unclear images, or incomplete location details..." rows={5} autoFocus />
            {rejectError && <div style={rejectStyles.error}>{rejectError}</div>}
            <div style={rejectStyles.actions}>
              <button className="btn btn-disabled" onClick={closeRejectCard} disabled={rejectSubmitting}>Cancel</button>
              <button className="btn btn-danger" onClick={submitRejectLocation} disabled={rejectSubmitting}>{rejectSubmitting ? "Sending..." : "Reject & Notify Owner"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon, text }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{text}</span></button>;
}

function DataTable({ columns, rows, emptyText, colSpan }) {
  return <div className="table-container"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length === 0 ? <EmptyRow colSpan={colSpan} text={emptyText} /> : rows}</tbody></table></div>;
}

function StatCard({ title, value, color }) {
  return <div className="stat-card"><h3>{title}</h3><div className={`value ${color ? `text-${color}` : ""}`}>{Number(value || 0).toLocaleString()}</div></div>;
}

function ProgressRow({ label, value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return <div className="chart-row"><div className="chart-label"><span>{label}</span><span>{safeValue}%</span></div><div className="progress-bg"><div className="progress-fill" style={{ width: `${safeValue}%` }} /></div></div>;
}

function StatusBadge({ text, type }) {
  return <span className={`badge badge-${type}`}>{text}</span>;
}

function EmptyRow({ colSpan, text }) {
  return <tr><td colSpan={colSpan} className="empty-cell">{text}</td></tr>;
}

function EventInfoCard({ icon, title, value, description, type }) {
  return <div className={`event-info-card ${type ? `event-info-${type}` : ""}`}><div className="event-info-icon">{icon}</div><div><h3>{title}</h3><strong>{Number(value || 0).toLocaleString()}</strong><p>{description}</p></div></div>;
}

function percentage(part, total) {
  if (!total || total === 0) return 0;
  return Math.round((Number(part || 0) / Number(total)) * 100);
}

function getBadgeType(status) {
  if (status === "APPROVED" || status === "PUBLISHED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

const rejectStyles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(0, 0, 0, 0.72)",
    backdropFilter: "blur(8px)",
  },
  card: {
    width: "min(560px, 100%)",
    position: "relative",
    padding: "28px",
    borderRadius: "24px",
    border: "1px solid rgba(239, 83, 80, 0.35)",
    background: "linear-gradient(160deg, #2a2020 0%, #211f1f 52%, #171717 100%)",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.55), 0 0 45px rgba(239, 83, 80, 0.14)",
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: "18px",
    right: "18px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
  },
  icon: {
    width: "54px",
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "18px",
    color: "#ef5350",
    background: "rgba(239, 83, 80, 0.13)",
    fontSize: "24px",
    marginBottom: "16px",
  },
  kicker: {
    margin: "0 0 6px",
    color: "#ffa726",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1.4px",
    fontWeight: 700,
  },
  title: {
    margin: "0 0 10px",
    fontSize: "26px",
  },
  description: {
    margin: "0 0 22px",
    color: "#cfcfcf",
    lineHeight: 1.6,
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    minHeight: "135px",
    resize: "vertical",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(0,0,0,0.26)",
    color: "#fff",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  error: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    color: "#ffb3b3",
    background: "rgba(239, 83, 80, 0.12)",
    border: "1px solid rgba(239, 83, 80, 0.2)",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "22px",
    flexWrap: "wrap",
  },
};
