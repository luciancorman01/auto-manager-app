import "./VehicleDetails.css";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function VehicleDetails() {
  const navigate = useNavigate();

  const [marca, setMarca] = useState("");
  const [model, setModel] = useState("");
  const [nrInmatriculare, setNrInmatriculare] = useState("");
  const [vin, setVin] = useState("");
  const [anFabricatie, setAnFabricatie] = useState("");

  const [insuranceDate, setInsuranceDate] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [itpDate, setItpDate] = useState("");
  const [vignetteDate, setVignetteDate] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const carModels = {
    Volkswagen: ["Golf 7", "Passat", "Arteon", "Tiguan"],
    Audi: ["A4", "A6", "Q5", "Q7"],
    BMW: ["320d", "520d", "X5"],
    Mercedes: ["C Class", "E Class", "GLE"],
    Dacia: ["Logan", "Duster", "Sandero"],
    Tesla: ["Model 3", "Model S", "Model X"],
  };

  const handleAddVehicle = async () => {
    setError("");

    if (!marca || !model || !nrInmatriculare || !vin || !anFabricatie) {
      setError("Marca, model, nr. înmatriculare, VIN și an fabricație sunt obligatorii.");
      return;
    }

    setLoading(true);

    try {
      const vehicleRes = await api.post("/vehicles", {
        marca,
        model,
        nr_inmatriculare: nrInmatriculare,
        vin,
        an_fabricatie: Number(anFabricatie),
      });

      const vehicleId = vehicleRes.data.vehicle.id;

      const documentPromises = [];

      if (insuranceDate) {
        documentPromises.push(
          api.post(`/vehicles/${vehicleId}/documents`, {
            tip: "RCA",
            data_expirare: insuranceDate,
            companie: insuranceCompany || null,
          })
        );
      }
      if (itpDate) {
        documentPromises.push(
          api.post(`/vehicles/${vehicleId}/documents`, {
            tip: "ITP",
            data_expirare: itpDate,
          })
        );
      }
      if (vignetteDate) {
        documentPromises.push(
          api.post(`/vehicles/${vehicleId}/documents`, {
            tip: "Rovinieta",
            data_expirare: vignetteDate,
          })
        );
      }

      await Promise.all(documentPromises);

      navigate("/fleet");
    } catch (err) {
      setError(err.response?.data?.message || "Eroare la salvarea vehiculului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="details-page">
      <Sidebar />
      <main className="details-content">

        <div className="details-header">
          <h1>My Fleet</h1>
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <span>⌕</span>
          </div>
        </div>

        <section className="car-details-box">
          <h2>Car details</h2>

          <div className="car-selects">
            <select
              value={marca}
              onChange={(e) => { setMarca(e.target.value); setModel(""); }}
            >
              <option value="">Select make</option>
              {Object.keys(carModels).map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="">Select model</option>
              {marca && carModels[marca].map((carModel) => (
                <option key={carModel} value={carModel}>{carModel}</option>
              ))}
            </select>

            <select
              value={anFabricatie}
              onChange={(e) => setAnFabricatie(e.target.value)}
            >
              <option value="">Select year</option>
              {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="car-selects" style={{ marginTop: "12px" }}>
            <input
              type="text"
              placeholder="Nr. înmatriculare (ex: BH 01 ABC)"
              value={nrInmatriculare}
              onChange={(e) => setNrInmatriculare(e.target.value.toUpperCase())}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
            />
            <input
              type="text"
              placeholder="VIN (17 caractere)"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
            />
          </div>
        </section>

        <section className="documents-grid">
          <div className="doc-card">
            <h3>Insurance (RCA)</h3>
            <label>Expires in</label>
            <input
              type="date"
              value={insuranceDate}
              onChange={(e) => setInsuranceDate(e.target.value)}
            />
            <label>Insurance Company</label>
            <input
              type="text"
              value={insuranceCompany}
              onChange={(e) => setInsuranceCompany(e.target.value)}
            />
          </div>

          <div className="doc-card">
            <h3>ITP</h3>
            <label>Expires in</label>
            <input
              type="date"
              value={itpDate}
              onChange={(e) => setItpDate(e.target.value)}
            />
          </div>

          <div className="doc-card">
            <h3>Rovinieta</h3>
            <label>Expires in</label>
            <input
              type="date"
              value={vignetteDate}
              onChange={(e) => setVignetteDate(e.target.value)}
            />
          </div>
        </section>

        {error && (
          <p className="error-message" style={{ color: "red", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button
          className="fleet-btn"
          onClick={handleAddVehicle}
          disabled={loading}
        >
          {loading ? "Se salvează..." : "Add to my Fleet"}
        </button>

      </main>
    </div>
  );
}

export default VehicleDetails;
