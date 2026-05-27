import "./Profile.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Eroare la fetch profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <main className="profile-content"><p>Se încarcă profilul...</p></main>
      </div>
    );
  }

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

        <section className="profile-card">
          <div className="edit-icon">✎</div>
          <h2>User Account Details</h2>
          <div className="profile-user">
            <div className="profile-avatar">
              {user?.poza_profil ? (
                <img src={user.poza_profil} alt="avatar" />
              ) : "👤"}
            </div>
            <div className="profile-info">
              <h3>{user?.nume_complet || "—"}</h3>
              <p>{user?.email || "—"}</p>
              <small>
                Cont creat:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ro-RO")
                  : "—"}
              </small>
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
          </div>

          <div className="info-card">
            <h2>Account Preferences</h2>
            <div className="preference-row">
              <p>Allow Reminders</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-row">
              <p>Account Language</p>
              <select>
                <option>English</option>
                <option>Romanian</option>
              </select>
            </div>
          </div>
        </section>

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
