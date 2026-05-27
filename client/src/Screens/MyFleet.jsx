import "./MyFleet.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyFleet() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (err) {
      setError("Nu s-au putut încărca vehiculele.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această mașină?")) return;
    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      alert("Eroare la ștergere.");
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("ro-RO") : "Necompletat";

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.marca.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.nr_inmatriculare.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      String(v.an_fabricatie).includes(q)
    );
  });

  return (
    <div className="fleet-page">
      <Sidebar />
      <main className="fleet-content">

        <div className="fleet-header">
          <div><h1>My Fleet</h1></div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span>⌕</span>
          </div>
        </div>

        <div className="fleet-top">
          <p>Total vehicles: <span>{vehicles.length}</span></p>
          <Link to="/vehicle-details">
            <button className="add-btn">+ Add vehicle</button>
          </Link>
        </div>

        {loading && <p>Se încarcă flota...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && filteredVehicles.length === 0 && (
          <p style={{ color: "#aaa", marginTop: "20px" }}>
            {searchQuery ? "Nicio mașină găsită pentru căutarea ta." : "Nu ai nicio mașină adăugată."}
          </p>
        )}

        <section className="cars-grid">
          {filteredVehicles.map((vehicle) => {
            const rcaDoc = vehicle.documents?.find((d) => d.tip === "RCA");
            const itpDoc = vehicle.documents?.find((d) => d.tip === "ITP");
            const rovinietaDoc = vehicle.documents?.find((d) => d.tip === "Rovinieta");

            return (
              <div className="car-card" key={vehicle.id}>
                <img
                  src={vehicle.poza || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"}
                  alt={`${vehicle.marca} ${vehicle.model}`}
                />
                <h2>{vehicle.marca} {vehicle.model}</h2>
                <div className="car-details">
                  <p><strong>Nr. înmatriculare:</strong> {vehicle.nr_inmatriculare}</p>
                  <p><strong>An fabricație:</strong> {vehicle.an_fabricatie}</p>
                  <p><strong>VIN:</strong> {vehicle.vin}</p>
                  <p><strong>RCA expiră:</strong> {formatDate(rcaDoc?.data_expirare)}</p>
                  <p><strong>ITP expiră:</strong> {formatDate(itpDoc?.data_expirare)}</p>
                  <p><strong>Rovinietă expiră:</strong> {formatDate(rovinietaDoc?.data_expirare)}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link to={`/vehicle-details/${vehicle.id}`}>
                    <button className="details-btn">Edit Details</button>
                  </Link>
                  <button
                    className="details-btn"
                    style={{ background: "#e74c3c" }}
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            );
          })}
        </section>

      </main>
    </div>
  );
}

export default MyFleet;
