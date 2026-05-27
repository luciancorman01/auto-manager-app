import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useUser } from "../context/UserContext";

function Sidebar() {
  const { user } = useUser();

  const numeComplet = user?.nume_complet || "";
  const displayName = numeComplet.length > 18
    ? numeComplet.split(" ")[0]
    : numeComplet || "...";

  return (
    <aside className="sidebar">
      <div className="logo">🚙 AutoCare</div>

      <nav className="menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-link active-link" : "menu-link"
          }
        >
          ⌂ Home
        </NavLink>

        <NavLink
          to="/fleet"
          className={({ isActive }) =>
            isActive ? "menu-link active-link" : "menu-link"
          }
        >
          ♙ My Fleet
        </NavLink>

        <NavLink
          to="/service"
          className={({ isActive }) =>
            isActive ? "menu-link active-link" : "menu-link"
          }
        >
          ☞ Service
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "menu-link active-link" : "menu-link"
          }
        >
          ♟ Profile
        </NavLink>
      </nav>

      <div className="user-box">
        <div className="avatar">
          {user?.poza_profil ? (
            <img src={user.poza_profil} alt="avatar" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <span className="user-name">{displayName}</span>
      </div>

      <p className="footer-text">
        Terms of Service
        <br />
        Copyright © 2026 AutoCare
      </p>
    </aside>
  );
}

export default Sidebar;
