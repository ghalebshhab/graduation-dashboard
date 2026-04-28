import { useState } from "react";
import { adminLogin } from "../api/adminAuthApi";
import "../Styles/admin-login.css";
import Logo from "../../public/OurLogo.png";
//ghaleb shhab
export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await adminLogin(email, password);

      if (!res.success) {
        setError(res.message);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("adminUsername", res.data.username);

      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Could not login. Check backend or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-logo">
          <img src={Logo} alt="JoMap Logo" />
        </div>

        <h1>Admin Login</h1>
        <p>Secure access to the JoMap dashboard.</p>

        {error && (
          <div className="admin-login-error">
            {/* Added a subtle warning SVG icon for a premium feel */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}