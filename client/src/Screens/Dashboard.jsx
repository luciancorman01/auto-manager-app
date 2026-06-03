import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Calculează câte zile mai sunt până la o dată
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Formatează zilele rămase într-un text lizibil
function formatDaysLeft(days) {
  if (days === null) return "Not set";
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  return `${months} ${months === 1 ? "month" : "months"}`;
}

// Returnează clasa CSS pentru progress bar în funcție de zile
function progressClass(days) {
  if (days === null) return "";
  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}

// Lățimea progress bar (max 365 zile = 100%, 6 luni = 50%)
function progressWidth(days) {
  if (days === null || days < 0) return "100%";
  const pct = Math.min((days / 365) * 100, 100);
  return `${pct}%`;
}

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, alertsRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/documents/alerts"),
        ]);
        setVehicles(vehiclesRes.data);
        setAlerts(alertsRes.data);
      } catch (err) {
        console.error("Eroare la încărcarea dashboard-ului:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Găsește cel mai apropiat document de un anumit tip din toată flota
  const getNextExpiry = (type) => {
    let best = null;
    for (const v of vehicles) {
      const doc = v.documents?.find((d) => d.tip === type);
      if (!doc) continue;
      const days = daysUntil(doc.data_expirare);
      if (best === null || days < best.days) {
        best = { days, vehicle: v, doc };
      }
    }
    return best;
  };

  const rcaNext = getNextExpiry("RCA");
  const itpNext = getNextExpiry("ITP");
  const rovNext = getNextExpiry("Rovinieta");

  // Vehicule cu cel puțin un document expirat sau care expiră în 30 zile
  const criticalVehicles = vehicles.filter((v) =>
    v.documents?.some((d) => {
      const days = daysUntil(d.data_expirare);
      return days !== null && days <= 30;
    }),
  );

  // Top 5 acțiuni prioritare — sortate după zile rămase
  const priorityActions = vehicles
    .flatMap((v) =>
      (v.documents || []).map((d) => ({
        vehicle: v,
        doc: d,
        days: daysUntil(d.data_expirare),
      })),
    )
    .filter((item) => item.days !== null && item.days <= 90)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  const docLabel = {
    RCA: "Renew Insurance",
    ITP: "Renew ITP",
    Rovinieta: "Renew Vignette",
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Home Dashboard</h1>
        </div>

        {loading ? (
          <p style={{ color: "#aaa" }}>Loading data...</p>
        ) : (
          <>
            {/* ALERT CARDS */}
            <section className="alerts">
              {/* RCA */}
              <div className="alert-card">
                <h3 style={{ paddingBottom: "16px" }}>Insurance Alert</h3>
                <div className="progress">
                  <div
                    className={`progress-fill ${progressClass(rcaNext?.days ?? null)}`}
                    style={{ width: progressWidth(rcaNext?.days ?? null) }}
                  />
                </div>
                {rcaNext ? (
                  <>
                    <p>
                      {rcaNext.vehicle.marca} {rcaNext.vehicle.model}
                    </p>
                    <strong>{formatDaysLeft(rcaNext.days)}</strong>
                  </>
                ) : (
                  <>
                    <p>Insurance expires</p>
                    <strong style={{ color: "#aaa" }}>No vehicles</strong>
                  </>
                )}
                {rcaNext && rcaNext.days <= 30 && (
                  <span className="alert-warning-icon">⚠️</span>
                )}
              </div>

              {/* ITP */}
              <div className="alert-card">
                <h3 style={{ paddingBottom: "16px" }}>ITP Alert</h3>
                <div className="progress">
                  <div
                    className={`progress-fill ${progressClass(itpNext?.days ?? null)}`}
                    style={{ width: progressWidth(itpNext?.days ?? null) }}
                  />
                </div>
                {itpNext ? (
                  <>
                    <p>
                      {itpNext.vehicle.marca} {itpNext.vehicle.model}
                    </p>
                    <strong>{formatDaysLeft(itpNext.days)}</strong>
                  </>
                ) : (
                  <>
                    <p>Next ITP due</p>
                    <strong style={{ color: "#aaa" }}>No vehicles</strong>
                  </>
                )}
                {itpNext && itpNext.days <= 30 && (
                  <span className="alert-warning-icon">⚠️</span>
                )}
              </div>

              {/* Rovinieta */}
              <div className="alert-card">
                <h3 style={{ paddingBottom: "16px" }}>Vigneta Alert</h3>
                <div className="progress">
                  <div
                    className={`progress-fill ${progressClass(rovNext?.days ?? null)}`}
                    style={{ width: progressWidth(rovNext?.days ?? null) }}
                  />
                </div>
                {rovNext ? (
                  <>
                    <p>
                      {rovNext.vehicle.marca} {rovNext.vehicle.model}
                    </p>
                    <strong>{formatDaysLeft(rovNext.days)}</strong>
                  </>
                ) : (
                  <>
                    <p>Vignette expires</p>
                    <strong style={{ color: "#aaa" }}>No vehicles</strong>
                  </>
                )}
                {rovNext && rovNext.days <= 30 && (
                  <span className="alert-warning-icon">⚠️</span>
                )}
              </div>
            </section>

            {/* BOTTOM SECTION */}
            <section className="bottom-section">
              {/* FLEET OVERVIEW */}
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
                    <strong>{criticalVehicles.length}</strong>
                    <p>
                      critical
                      <br />
                      vehicles
                    </p>
                  </div>
                </div>

                <div className="priority-bar" />

                <h4>Top priority actions:</h4>

                {priorityActions.length === 0 ? (
                  <p style={{ color: "#aaa", fontSize: "14px" }}>
                    No urgent actions. Everything is up to date! ✅
                  </p>
                ) : (
                  <ul className="actions">
                    {priorityActions.map((item, idx) => (
                      <li key={`${item.vehicle.id}-${item.doc.tip}`}>
                        <span>{idx + 1}</span>
                        {item.vehicle.marca} {item.vehicle.model}:{" "}
                        {docLabel[item.doc.tip] || item.doc.tip}
                        <em>{formatDaysLeft(item.days)}</em>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* SERVICE MAP */}
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
