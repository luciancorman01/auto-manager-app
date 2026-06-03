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
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      alert("Error deleting vehicle.");
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "Not provided";

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
          <div>
            <h1>My Fleet</h1>
          </div>
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
          <p>
            Total vehicles: <span>{vehicles.length}</span>
          </p>
          <Link to="/vehicle-details">
            <button className="add-btn">+ Add vehicle</button>
          </Link>
        </div>

        {loading && <p>Loading fleet...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && filteredVehicles.length === 0 && (
          <p style={{ color: "#aaa", marginTop: "20px" }}>
            {searchQuery
              ? "No vehicles found for your search."
              : "You have no vehicles added."}
          </p>
        )}

        <section className="cars-grid">
          {filteredVehicles.map((vehicle) => {
            const rcaDoc = vehicle.documents?.find((d) => d.tip === "RCA");
            const itpDoc = vehicle.documents?.find((d) => d.tip === "ITP");
            const rovinietaDoc = vehicle.documents?.find(
              (d) => d.tip === "Rovinieta",
            );

            return (
              <div className="car-card" key={vehicle.id}>
                <img
                  src={
                    vehicle.poza ||
                    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
                  }
                  alt={`${vehicle.marca} ${vehicle.model}`}
                />
                <h2>
                  {vehicle.marca} {vehicle.model}
                </h2>
                <div className="car-details">
                  <p>
                    <strong>Registration:</strong> {vehicle.nr_inmatriculare}
                  </p>
                  <p>
                    <strong>Year:</strong> {vehicle.an_fabricatie}
                  </p>
                  <p>
                    <strong>VIN:</strong> {vehicle.vin}
                  </p>
                  <p>
                    <strong>Insurance expires:</strong>{" "}
                    {formatDate(rcaDoc?.data_expirare)}
                  </p>
                  <p>
                    <strong>ITP expires:</strong>{" "}
                    {formatDate(itpDoc?.data_expirare)}
                  </p>
                  <p>
                    <strong>Vignette expires:</strong>{" "}
                    {formatDate(rovinietaDoc?.data_expirare)}
                  </p>
                </div>
                <div className="card-actions">
                  <Link to={`/vehicle-details/${vehicle.id}`}>
                    <button className="edit-btn">Edit Details</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(vehicle.id)}
                    title="Delete vehicle"
                  >
                    🗑
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
