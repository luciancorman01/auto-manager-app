import "./Profile.css";
import Sidebar from "../components/Sidebar";

function Profile() {

  return (
    <div className="profile-page">

      <Sidebar />

      <main className="profile-content">

        {/* HEADER */}

        <div className="profile-header">

          <h1>My Profile</h1>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>⌕</span>
          </div>

        </div>

        {/* USER CARD */}

        <section className="profile-card">

          <div className="edit-icon">
            ✎
          </div>

          <h2>User Account Details</h2>

          <div className="profile-user">

            <div className="profile-avatar">
              👤
            </div>

            <div className="profile-info">

              <h3>User Name</h3>

              <p>username@gmail.com</p>

            </div>

          </div>

        </section>

        {/* BOTTOM */}

        <section className="profile-bottom">

          {/* CONTACT */}

          <div className="info-card">

            <h2>Contact Informations</h2>

            <div className="contact-item">
              <span>📞</span>
              <p>+40 7xx xxx xxx</p>
            </div>

            <div className="contact-item">
              <span>✉</span>
              <p>username@gmail.com</p>
            </div>

            <div className="contact-item">
              <span>📍</span>
              <p>strada x-ulescu, nr. 10</p>
            </div>

          </div>

          {/* PREFERENCES */}

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

        {/* LOGOUT */}

        <div className="logout-container">

          <button className="logout-btn">
            Log out
          </button>

        </div>

      </main>

    </div>
  );
}

export default Profile;