import "./Profile.css";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        const cached = localStorage.getItem("user");
        if (cached) setUser(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>⌕</span>
          </div>
        </div>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <section className="profile-card">
              <div className="edit-icon">✎</div>

              <h2>User Account Details</h2>

              <div className="profile-user">
                <div className="profile-avatar">👤</div>

                <div className="profile-info">
                  <h3>{user?.nume_complet || "User"}</h3>
                  <p>{user?.email || "—"}</p>
                </div>
              </div>
            </section>

            <section className="profile-bottom">
              <div className="info-card">
                <h2>Contact Informations</h2>

                <div className="contact-item">
                  <span>✉</span>
                  <p>{user?.email || "—"}</p>
                </div>

                <div className="contact-item">
                  <span>📅</span>
                  <p>
                    Member since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("ro-RO")
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="info-card">
                <h2>Account Preferences</h2>

                <div className="preference-row">
                  <p>Allow Reminders</p>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="preference-row">
                  <p>Account Language</p>

                  <select defaultValue="English">
                    <option>English</option>
                    <option>Romanian</option>
                  </select>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}

export default Profile;
