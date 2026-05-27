import "./VehicleDetails.css";
import Sidebar from "../components/sidebar";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { findDocument } from "../utils/documents";
import carPlaceholder from "../assets/car-placeholder.svg";

function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [marca, setMarca] = useState("");
  const [model, setModel] = useState("");
  const [anFabricatie, setAnFabricatie] = useState("");
  const [nrInmatriculare, setNrInmatriculare] = useState("");
  const [vin, setVin] = useState("");

  const [insuranceDate, setInsuranceDate] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [insuranceDocId, setInsuranceDocId] = useState(null);

  const [itpDate, setItpDate] = useState("");
  const [itpCompany, setItpCompany] = useState("");
  const [itpDocId, setItpDocId] = useState(null);

  const [vignetteDate, setVignetteDate] = useState("");
  const [vignetteCompany, setVignetteCompany] = useState("");
  const [vignetteDocId, setVignetteDocId] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const carModels = {
    Volkswagen: ["Golf 7", "Passat", "Arteon", "Tiguan"],
    Audi: ["A4", "A6", "Q5", "Q7"],
    BMW: ["320d", "520d", "X5"],
    Mercedes: ["C Class", "E Class", "GLE"],
    Dacia: ["Logan", "Duster", "Sandero"],
    Tesla: ["Model 3", "Model S", "Model X"],
  };

  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setMarca(data.marca);
        setModel(data.model);
        setAnFabricatie(String(data.an_fabricatie));
        setNrInmatriculare(data.nr_inmatriculare);
        setVin(data.vin);
        setPhotos(data.photos || []);

        const rca = findDocument(data.documents, "RCA");
        const itp = findDocument(data.documents, "ITP");
        const rovinieta = findDocument(data.documents, "Rovinieta");

        if (rca) {
          setInsuranceDocId(rca.id);
          setInsuranceDate(rca.data_expirare.split("T")[0]);
          setInsuranceCompany(rca.companie || "");
        }
        if (itp) {
          setItpDocId(itp.id);
          setItpDate(itp.data_expirare.split("T")[0]);
          setItpCompany(itp.companie || "");
        }
        if (rovinieta) {
          setVignetteDocId(rovinieta.id);
          setVignetteDate(rovinieta.data_expirare.split("T")[0]);
          setVignetteCompany(rovinieta.companie || "");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Nu s-au putut încărca detaliile.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit]);

  const saveDocument = async (
    vehicleId,
    docId,
    tip,
    dataExpirare,
    companie,
  ) => {
    if (!dataExpirare) return;

    const payload = {
      tip,
      data_expirare: dataExpirare,
      companie: companie || undefined,
    };

    if (docId) {
      await api.put(`/documents/${docId}`, payload);
    } else {
      await api.post(`/vehicles/${vehicleId}/documents`, payload);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files || []));
  };

  const getPhotoUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000"}${imageUrl}`;
  };

  const uploadFiles = async (vehicleId) => {
    if (selectedFiles.length === 0) return;
    await Promise.all(
      selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("photo", file);
        await api.post(`/vehicles/${vehicleId}/photos`, formData);
      }),
    );
  };

  const refreshPhotos = async (vehicleId) => {
    const { data } = await api.get(`/vehicles/${vehicleId}`);
    setPhotos(data.photos || []);
  };

  const handleSetPrimaryPhoto = async (photoId) => {
    try {
      await api.patch(`/vehicles/${id}/photos/${photoId}/primary`);
      setPhotos((prev) =>
        prev
          .map((photo) => ({ ...photo, is_primary: photo.id === photoId }))
          .sort((a, b) => Number(b.is_primary) - Number(a.is_primary)),
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Nu s-a putut seta poza principală.",
      );
    }
  };

  const handleDeleteVehicle = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      "Ești sigur că vrei să ștergi acest vehicul?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/${id}`);
      navigate("/fleet");
    } catch (err) {
      setError(err.response?.data?.message || "Nu s-a putut șterge vehiculul.");
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    if (!marca || !model || !anFabricatie || !nrInmatriculare || !vin) {
      setError("Completează toate câmpurile vehiculului.");
      setSaving(false);
      return;
    }

    const vehiclePayload = {
      marca,
      model,
      nr_inmatriculare: nrInmatriculare,
      vin,
      an_fabricatie: Number(anFabricatie),
    };

    try {
      let vehicleId = id;

      if (isEdit) {
        await api.put(`/vehicles/${id}`, vehiclePayload);
      } else {
        const { data } = await api.post("/vehicles", vehiclePayload);
        vehicleId = data.vehicle.id;
      }

      await Promise.all([
        saveDocument(
          vehicleId,
          insuranceDocId,
          "RCA",
          insuranceDate,
          insuranceCompany,
        ),
        saveDocument(vehicleId, itpDocId, "ITP", itpDate, itpCompany),
        saveDocument(
          vehicleId,
          vignetteDocId,
          "Rovinieta",
          vignetteDate,
          vignetteCompany,
        ),
      ]);

      await uploadFiles(vehicleId);

      navigate("/fleet");
    } catch (err) {
      setError(err.response?.data?.message || "Nu s-a putut salva vehiculul.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.delete(`/vehicles/${id}/photos/${photoId}`);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (err) {
      setError(err.response?.data?.message || "Nu s-a putut șterge poza.");
    }
  };

  const handleUploadForExistingVehicle = async () => {
    if (!id || selectedFiles.length === 0) return;
    setSaving(true);
    setError("");
    try {
      await uploadFiles(id);
      await refreshPhotos(id);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || "Nu s-au putut încărca pozele.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <Sidebar />
        <main className="details-content">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

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
              onChange={(e) => {
                setMarca(e.target.value);
                setModel("");
              }}
            >
              <option value="">Select make</option>
              {Object.keys(carModels).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">Select model</option>
              {marca &&
                carModels[marca].map((carModel) => (
                  <option key={carModel} value={carModel}>
                    {carModel}
                  </option>
                ))}
            </select>

            <select
              value={anFabricatie}
              onChange={(e) => setAnFabricatie(e.target.value)}
            >
              <option value="">Select year</option>
              {["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ),
              )}
            </select>

            <input
              type="text"
              placeholder="License plate (e.g. B 123 ABC)"
              value={nrInmatriculare}
              onChange={(e) => setNrInmatriculare(e.target.value)}
            />

            <input
              type="text"
              placeholder="VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              disabled={isEdit}
            />
          </div>
        </section>

        <section className="car-details-box">
          <h2>Vehicle photos</h2>
          <div className="photos-actions">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {isEdit ? (
              <button
                className="photo-btn"
                onClick={handleUploadForExistingVehicle}
                disabled={saving}
              >
                Upload selected photos
              </button>
            ) : (
              <p className="photo-help">
                Pozele vor fi încărcate după ce salvezi mașina.
              </p>
            )}
          </div>

          <div className="photos-grid">
            {photos.length > 0 ? (
              photos.map((photo) => (
                <div className="photo-item" key={photo.id}>
                  <img src={getPhotoUrl(photo.image_url)} alt="Vehicle" />
                  <button
                    className="photo-primary-btn"
                    onClick={() => handleSetPrimaryPhoto(photo.id)}
                    disabled={photo.is_primary}
                  >
                    {photo.is_primary ? "Primary photo" : "Set as primary"}
                  </button>
                  <button
                    className="photo-delete-btn"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="photo-item photo-placeholder">
                <img src={carPlaceholder} alt="No photo" />
                <p className="photo-help">Nicio poză încărcată.</p>
              </div>
            )}
          </div>
        </section>

        <section className="documents-grid">
          <div className="doc-card">
            <h3>Insurance (RCA)</h3>

            <label>Expires on</label>
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

            <label>Expires on</label>
            <input
              type="date"
              value={itpDate}
              onChange={(e) => setItpDate(e.target.value)}
            />

            <label>Service / Company</label>
            <input
              type="text"
              value={itpCompany}
              onChange={(e) => setItpCompany(e.target.value)}
            />
          </div>

          <div className="doc-card">
            <h3>Vigneta</h3>

            <label>Expires on</label>
            <input
              type="date"
              value={vignetteDate}
              onChange={(e) => setVignetteDate(e.target.value)}
            />

            <label>Provider / Country</label>
            <input
              type="text"
              value={vignetteCompany}
              onChange={(e) => setVignetteCompany(e.target.value)}
            />
          </div>
        </section>

        {error && <p className="error-message">{error}</p>}

        <button className="fleet-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add to my Fleet"}
        </button>
        {isEdit && (
          <button
            className="delete-vehicle-btn"
            onClick={handleDeleteVehicle}
            disabled={saving}
          >
            Delete vehicle
          </button>
        )}
      </main>
    </div>
  );
}

export default VehicleDetails;
