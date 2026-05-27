import "./Dashboard.css";

import Sidebar from "../components/sidebar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { getDocLabel, formatDaysRemaining } from "../utils/documents";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const ALERT_PROGRESS = {
  RCA: "insurance",
  ITP: "itp",
  Rovinieta: "vigneta",
};

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [alertsRes, vehiclesRes] = await Promise.all([
          api.get("/documents/alerts"),
          api.get("/vehicles"),
        ]);
        setAlerts(alertsRes.data);
        setVehicles(vehiclesRes.data);
      } catch {
        setAlerts([]);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const criticalCount = new Set(
    alerts.filter((a) => a.status === "red" || a.status === "yellow").map((a) => a.vehicle_id)
  ).size;

  const topAlerts = alerts.slice(0, 3);

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Home Dashboard</h1>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>⌕</span>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="alerts">
              {topAlerts.length === 0 ? (
                <div className="alert-card">
                  <h3>No alerts</h3>
                  <p>All documents are up to date.</p>
                </div>
              ) : (
                topAlerts.map((alert) => (
                  <div className="alert-card" key={alert.id}>
                    <h3>{getDocLabel(alert.tip)} Alert</h3>

                    <div className="progress">
                      <div
                        className={`progress-fill ${ALERT_PROGRESS[alert.tip] || "insurance"}`}
                      ></div>
                    </div>

                    <p>{getDocLabel(alert.tip)} expires</p>

                    <strong>{formatDaysRemaining(alert.zile_ramase)}</strong>

                    <span className="warning">⚠️</span>
                  </div>
                ))
              )}
            </section>

            <section className="bottom-section">
              <div className="fleet-card">
                <h3>Fleet Overview</h3>

                <div className="fleet-numbers">
                  <div>
                    <strong>{vehicles.length}</strong>
                    <p>
                      total
                      <br />
                      vehicles
                    </p>
                  </div>

                  <div>
                    <strong>{criticalCount}</strong>
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
                  {topAlerts.length === 0 ? (
                    <li>No urgent actions.</li>
                  ) : (
                    topAlerts.map((alert, index) => (
                      <li key={alert.id}>
                        <span>{index + 1}</span>
                        {alert.vehicle.marca} {alert.vehicle.model}: Renew{" "}
                        {getDocLabel(alert.tip)}
                        <em>{formatDaysRemaining(alert.zile_ramase)} remaining</em>
                      </li>
                    ))
                  )}
                </ul>
              </div>

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
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[47.0722, 21.9214]}>
                      <Popup>Auto Total Service</Popup>
                    </Marker>

                    <Marker position={[47.055, 21.933]}>
                      <Popup>BMW Service Oradea</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                <Link to="/service">
                  <button>Book service</button>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
