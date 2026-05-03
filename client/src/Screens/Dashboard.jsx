import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="logo">🚙 AutoCare</div>

        <nav className="menu">
          <a href="#">⌂ Home</a>
          <a href="#">♙ My Fleet</a>
          <a href="#">☞ Service</a>
          <a href="#">♟ Profile</a>
        </nav>

        <div className="user-box">
          <div className="avatar"></div>
          <span>username</span>
        </div>

        <p className="footer-text">Terms of Service<br />Copyright © 2026 AutoCare</p>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Home Dashboard</h1>
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>⌕</span>
          </div>
        </div>

        <section className="alerts">
          <div className="alert-card">
            <h3>Insurance Alert</h3>
            <div className="progress">
              <div className="progress-fill insurance"></div>
            </div>
            <p>Insurance expires</p>
            <strong>40 days</strong>
            <span className="warning">⚠️</span>
          </div>

          <div className="alert-card">
            <h3>ITP Alert</h3>
            <div className="progress">
              <div className="progress-fill itp"></div>
            </div>
            <p>Next ITP due</p>
            <strong>2 months</strong>
            <span className="warning">⚠️</span>
          </div>

          <div className="alert-card">
            <h3>Vigneta Alert</h3>
            <div className="progress">
              <div className="progress-fill vigneta"></div>
            </div>
            <p>Rovigneta expires</p>
            <strong>71 days</strong>
            <span className="warning">⚠️</span>
          </div>
        </section>

        <section className="bottom-section">
          <div className="fleet-card">
            <h3>Fleet Overview</h3>

            <div className="fleet-numbers">
              <div>
                <strong>5</strong>
                <p>total<br />vehicles</p>
              </div>

              <div>
                <strong>2</strong>
                <p>critical<br />vehicles</p>
              </div>
            </div>

            <div className="priority-bar"></div>

            <h4>Top 3 priority actions:</h4>

            <ul className="actions">
              <li><span>1</span> Volkswagen Golf 7: Renew Insurance <em>40 days remaining</em></li>
              <li><span>2</span> Volkswagen Arteon: Renew ITP <em>2 months remaining</em></li>
              <li><span>3</span> Volkswagen Golf 7: Renew Rovigneta <em>70 days remaining</em></li>
            </ul>
          </div>

          <div className="service-card">
            <h3>Service:</h3>
            <div className="map-box"></div>
            <button>Book service</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;