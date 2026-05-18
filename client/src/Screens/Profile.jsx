import "./Profile.css";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Profile() {
const [isEditing, setIsEditing] = useState(false);

const [name, setName] = useState("User Name");

const [email, setEmail] = useState("username@gmail.com");

const [phone, setPhone] = useState("+40 7xx xxx xxx");

const [address, setAddress] = useState(
  "strada x-ulescu, nr. 10"
);

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

<div
  className="edit-icon"
  onClick={() => setIsEditing(!isEditing)}
>
  ✎
</div>

          <h2>User Account Details</h2>

          <div className="profile-user">

            <div className="profile-avatar">
              👤
            </div>

<div className="profile-info">

  {isEditing ? (

    <>
      <input
        className="profile-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="profile-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </>

  ) : (

    <>
      <h3>{name}</h3>

      <p>{email}</p>
    </>

  )}

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

  {isEditing ? (

    <input
      className="profile-input small-input"
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

  ) : (

    <p>{phone}</p>

  )}

</div>

<div className="contact-item">

  <span>✉</span>

  {isEditing ? (

    <input
      className="profile-input small-input"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

  ) : (

    <p>{email}</p>

  )}

</div>

<div className="contact-item">

  <span>📍</span>

  {isEditing ? (

    <input
      className="profile-input small-input"
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />

  ) : (

    <p>{address}</p>

  )}

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