import "./Dashboard.css";

import Sidebar from "../components/Sidebar";

import { Link } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function Dashboard() {

  return (
    <div className="dashboard-page">

      <Sidebar />

      <main className="dashboard-content">

        <div className="dashboard-header">

          <h1>Home Dashboard</h1>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search..."
            />

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

                <p>
                  total
                  <br />
                  vehicles
                </p>

              </div>

              <div>

                <strong>2</strong>

                <p>
                  critical
                  <br />
                  vehicles
                </p>

              </div>

            </div>

            <div className="priority-bar"></div>

            <h4>Top 3 priority actions:</h4>

            <ul className="actions">

              <li>

                <span>1</span>

                Volkswagen Golf 7:
                Renew Insurance

                <em>
                  40 days remaining
                </em>

              </li>

              <li>

                <span>2</span>

                Volkswagen Arteon:
                Renew ITP

                <em>
                  2 months remaining
                </em>

              </li>

              <li>

                <span>3</span>

                Volkswagen Golf 7:
                Renew Rovigneta

                <em>
                  70 days remaining
                </em>

              </li>

            </ul>

          </div>

          {/* SERVICE */}

          <div className="service-card">

            <h3>Service:</h3>

            <div className="map-box">

              <MapContainer
                center={[47.0722, 21.9214]}
                zoom={12}
                scrollWheelZoom={false}
                className="dashboard-map"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[47.0722, 21.9214]}
                >

                  <Popup>
                    Auto Total Service
                  </Popup>

                </Marker>

                <Marker
                  position={[47.0550, 21.9330]}
                >

                  <Popup>
                    BMW Service Oradea
                  </Popup>

                </Marker>

              </MapContainer>

            </div>

            <Link to="/service">

              <button>
                Book service
              </button>

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;