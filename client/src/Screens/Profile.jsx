import "./Profile.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Profile() {
  const navigate = useNavigate();
  const { user, loadingUser, clearUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  if (loadingUser) {
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
