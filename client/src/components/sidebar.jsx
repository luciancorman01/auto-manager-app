import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
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
        <div className="avatar"></div>
        <span>username</span>
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