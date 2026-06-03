import "./VehicleDetails.css";
import Sidebar from "../components/Sidebar";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Select from "react-select";

import api from "../api";

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;
const NR_INMATRICULARE_REGEX = /^[A-Z]{1,2}\s?\d{2,3}\s?[A-Z]{2,3}$/i;
const CURRENT_YEAR = new Date().getFullYear();
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const BLOCKED_NR = ["BOU", "BOY", "JEG", "JAF", "CUR", "PIZ", "MUE", "GAY"];

function validateNrInmatriculare(nr) {
  const normalized = nr.replace(/\s/g, "").toUpperCase();

  if (!NR_INMATRICULARE_REGEX.test(nr.trim())) {
    return "Registration number is not valid (e.g. BH 01 ABC).";
  }
  if (normalized.includes("Q")) {
    return "Registration number cannot contain the letter Q.";
  }
  if (/^[IO]/i.test(normalized)) {
    return "Registration number cannot start with the letter I or O.";
  }
  if (/III|OOO/.test(normalized)) {
    return "Registration number cannot contain combinations like III or OOO.";
  }
  const blocked = BLOCKED_NR.find((w) => normalized.includes(w));
  if (blocked) {
    return `Registration number contains a forbidden combination (${blocked}).`;
  }
  return null;
}

function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const fileInputRef = useRef(null);

  const [marca, setMarca] = useState("");
  const [model, setModel] = useState("");
  const [nrInmatriculare, setNrInmatriculare] = useState("");
  const [vin, setVin] = useState("");
  const [anFabricatie, setAnFabricatie] = useState("");

  const [poza, setPoza] = useState(null); // Base64 string
  const [pozaPreview, setPozaPreview] = useState(null); // URL pentru preview

  const [insuranceDate, setInsuranceDate] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [itpDate, setItpDate] = useState("");
  const [vignetteDate, setVignetteDate] = useState("");

  // ID-uri documente existente (pentru edit mode)
  const [rcaDocId, setRcaDocId] = useState(null);
  const [itpDocId, setItpDocId] = useState(null);
  const [rovDocId, setRovDocId] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        const v = res.data;
        setMarca(v.marca || "");
        setModel(v.model || "");
        setNrInmatriculare(v.nr_inmatriculare || "");
        setVin(v.vin || "");
        setAnFabricatie(v.an_fabricatie ? String(v.an_fabricatie) : "");

        if (v.poza) {
          setPoza(v.poza);
          setPozaPreview(v.poza);
        }

        const rcaDoc = v.documents?.find((d) => d.tip === "RCA");
        const itpDoc = v.documents?.find((d) => d.tip === "ITP");
        const rovDoc = v.documents?.find((d) => d.tip === "Rovinieta");

        if (rcaDoc) {
          setInsuranceDate(
            rcaDoc.data_expirare ? rcaDoc.data_expirare.split("T")[0] : "",
          );
          setInsuranceCompany(rcaDoc.companie || "");
          setRcaDocId(rcaDoc.id);
        }
        if (itpDoc) {
          setItpDate(
            itpDoc.data_expirare ? itpDoc.data_expirare.split("T")[0] : "",
          );
          setItpDocId(itpDoc.id);
        }
        if (rovDoc) {
          setVignetteDate(
            rovDoc.data_expirare ? rovDoc.data_expirare.split("T")[0] : "",
          );
          setRovDocId(rovDoc.id);
        }
      } catch (err) {
        setError("Failed to load vehicle data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchVehicle();
  }, [id, isEditMode]);

  // Handler pentru selectarea imaginii
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("The selected file is not a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image is too large. Maximum 5MB.");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPoza(base64);
      setPozaPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPoza(null);
    setPozaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const carModels = {
    Volkswagen: [
      "Golf 4",
      "Golf 5",
      "Golf 6",
      "Golf 7",
      "Golf 8",
      "Passat",
      "Arteon",
      "Tiguan",
      "Touareg",
      "Polo",
      "Jetta",
    ],
    Audi: [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "Q1",
      "Q2",
      "Q3",
      "Q4",
      "Q5",
      "Q6",
      "Q7",
      "Q8",
      "RS3",
      "RS4",
      "RS6",
      "TT",
    ],
    BMW: [
      "116d",
      "118i",
      "320d",
      "330e",
      "520d",
      "530e",
      "740d",
      "X1",
      "X3",
      "X5",
      "X6",
      "X7",
      "M3",
      "M4",
      "M5",
    ],
    Mercedes: [
      "A Class",
      "B Class",
      "C Class",
      "E Class",
      "S Class",
      "CLA",
      "CLS",
      "GLA",
      "GLC",
      "GLE",
      "GLS",
      "AMG GT",
    ],
    Dacia: ["Logan", "Duster", "Sandero", "Spring", "Jogger"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
    Porsche: ["911", "Cayenne", "Panamera", "Macan", "Taycan"],
    Ford: ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "Mustang", "Ranger"],
    Toyota: [
      "Corolla",
      "Camry",
      "Yaris",
      "RAV4",
      "Land Cruiser",
      "Prius",
      "Supra",
    ],
    Renault: ["Clio", "Megane", "Talisman", "Kadjar", "Captur"],
    Peugeot: ["208", "308", "508", "2008", "3008", "5008"],
    Skoda: ["Fabia", "Octavia", "Superb", "Kodiaq", "Kamiq"],
    Seat: ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco"],
    Hyundai: ["i20", "i30", "Tucson", "Santa Fe", "Kona"],
    Kia: ["Ceed", "Sportage", "Sorento", "Stinger", "Picanto"],
    Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland"],
    Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "370Z"],
    Honda: ["Civic", "Accord", "CR-V", "HR-V"],
    Mazda: ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-5"],
    Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
    Lexus: ["IS", "ES", "RX", "NX", "UX"],
    Ferrari: ["488 GTB", "F8", "Roma", "SF90"],
    Lamborghini: ["Huracan", "Aventador", "Urus"],
    Bentley: ["Bentayga", "Continental GT", "Flying Spur"],
    "Rolls Royce": ["Ghost", "Phantom", "Cullinan"],
  };

  const years = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: "#666a80",
      border: "none",
      borderRadius: "18px",
      minHeight: "46px",
      boxShadow: "none",
      paddingLeft: "6px",
    }),
    menu: (provided) => ({
      ...provided,
      background: "#666a80",
      borderRadius: "18px",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "#7d82a5" : "#666a80",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({ ...provided, color: "white" }),
    placeholder: (provided) => ({ ...provided, color: "white" }),
  };

  const validate = () => {
    if (!marca || !model || !nrInmatriculare || !vin || !anFabricatie) {
      return "Make, model, registration number, VIN and year are required.";
    }
    if (!VIN_REGEX.test(vin.trim())) {
      return "VIN must be exactly 17 valid alphanumeric characters (no I, O, Q).";
    }
    const nrError = validateNrInmatriculare(nrInmatriculare);
    if (nrError) return nrError;

    const an = Number(anFabricatie);
    if (isNaN(an) || an < 1900 || an > CURRENT_YEAR) {
      return `Year of manufacture must be between 1900 and ${CURRENT_YEAR}.`;
    }
    if (insuranceDate && isNaN(new Date(insuranceDate).getTime())) {
      return "Insurance (RCA) expiry date is not valid.";
    }
    if (itpDate && isNaN(new Date(itpDate).getTime())) {
      return "ITP expiry date is not valid.";
    }
    if (vignetteDate && isNaN(new Date(vignetteDate).getTime())) {
      return "Vignette expiry date is not valid.";
    }
    return null;
  };

  const handleSave = async () => {
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      let vehicleId;

      if (isEditMode) {
        await api.put(`/vehicles/${id}`, {
          marca,
          model,
          nr_inmatriculare: nrInmatriculare,
          vin,
          an_fabricatie: Number(anFabricatie),
          poza: poza || null,
        });
        vehicleId = Number(id);

        // Upsert documente în edit mode
        const upsertDoc = async (tip, date, docId, extra = {}) => {
          if (!date) return;
          if (docId) {
            await api.put(`/documents/${docId}`, {
              data_expirare: date,
              ...extra,
            });
          } else {
            await api.post(`/vehicles/${vehicleId}/documents`, {
              tip,
              data_expirare: date,
              ...extra,
            });
          }
        };

        await Promise.all([
          upsertDoc("RCA", insuranceDate, rcaDocId, {
            companie: insuranceCompany || null,
          }),
          upsertDoc("ITP", itpDate, itpDocId),
          upsertDoc("Rovinieta", vignetteDate, rovDocId),
        ]);
      } else {
        const vehicleRes = await api.post("/vehicles", {
          marca,
          model,
          nr_inmatriculare: nrInmatriculare,
          vin,
          an_fabricatie: Number(anFabricatie),
          poza: poza || null,
        });
        vehicleId = vehicleRes.data.vehicle.id;
      }

      if (!isEditMode) {
        const documentPromises = [];

        if (insuranceDate) {
          documentPromises.push(
            api.post(`/vehicles/${vehicleId}/documents`, {
              tip: "RCA",
              data_expirare: insuranceDate,
              companie: insuranceCompany || null,
            }),
          );
        }
        if (itpDate) {
          documentPromises.push(
            api.post(`/vehicles/${vehicleId}/documents`, {
              tip: "ITP",
              data_expirare: itpDate,
            }),
          );
        }
        if (vignetteDate) {
          documentPromises.push(
            api.post(`/vehicles/${vehicleId}/documents`, {
              tip: "Rovinieta",
              data_expirare: vignetteDate,
            }),
          );
        }

        await Promise.all(documentPromises);
      }

      navigate("/fleet");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (!msg && poza && poza.length > 7_000_000) {
        setError("Imaginea este prea mare. Te rog alege o fotografie sub 5MB.");
      } else {
        setError(
          msg || "A apărut o eroare la salvarea vehiculului. Încearcă din nou.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="details-page">
        <Sidebar />
        <main className="details-content">
          <p>Loading vehicle data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="details-page">
      <Sidebar />

      <main className="details-content">
        <div className="details-header">
          <h1>{isEditMode ? "Edit Vehicle" : "Add Vehicle"}</h1>
        </div>

        <section className="car-details-box">
          <h2>Car details</h2>

          <div className="car-selects">
            <Select
              options={Object.keys(carModels).map((brand) => ({
                value: brand,
                label: brand,
              }))}
              placeholder="Select make"
              value={marca ? { value: marca, label: marca } : null}
              onChange={(selected) => {
                setMarca(selected.value);
                if (selected.value !== marca) setModel("");
              }}
              styles={customStyles}
            />

            <Select
              options={
                marca
                  ? carModels[marca]?.map((carModel) => ({
                      value: carModel,
                      label: carModel,
                    })) || []
                  : []
              }
              placeholder="Select model"
              value={model ? { value: model, label: model } : null}
              onChange={(selected) => setModel(selected.value)}
              styles={customStyles}
            />

            <Select
              options={years.map((year) => ({
                value: year,
                label: year,
              }))}
              placeholder="Select year"
              value={
                anFabricatie
                  ? { value: Number(anFabricatie), label: Number(anFabricatie) }
                  : null
              }
              onChange={(selected) => setAnFabricatie(selected.value)}
              styles={customStyles}
            />
          </div>

          <div className="car-selects" style={{ marginTop: "12px" }}>
            <input
              type="text"
              placeholder="Registration number (e.g. BH 01 ABC)"
              value={nrInmatriculare}
              onChange={(e) => setNrInmatriculare(e.target.value.toUpperCase())}
            />

            <input
              type="text"
              placeholder="VIN (17 caractere)"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
            />
          </div>

          {/* IMAGE UPLOAD — sub câmpurile de detalii */}
          <div className="image-upload-section">
            <label className="image-upload-label">
              Vehicle Photo{" "}
              <span style={{ color: "#9ba3d9", fontWeight: 400 }}>
                (optional)
              </span>
            </label>

            <div
              className="image-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {pozaPreview ? (
                <img
                  src={pozaPreview}
                  alt="Vehicle preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to add a photo</p>
                  <small>JPG, PNG, WEBP — max 5MB</small>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            {pozaPreview && (
              <button
                className="remove-image-btn"
                onClick={handleRemoveImage}
                type="button"
              >
                ✕ Remove photo
              </button>
            )}
          </div>
        </section>

        {/* Documentele se afișează și la editare */}
        <section className="documents-grid">
          <div className="doc-card">
            <h3>Insurance (RCA)</h3>
            <label>Expiry date</label>
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
            <label>Expiry date</label>
            <input
              type="date"
              value={itpDate}
              onChange={(e) => setItpDate(e.target.value)}
            />
          </div>

          <div className="doc-card">
            <h3>Vignette</h3>
            <label>Expiry date</label>
            <input
              type="date"
              value={vignetteDate}
              onChange={(e) => setVignetteDate(e.target.value)}
            />
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <span className="error-banner-icon">⚠</span>
            <span>{error}</span>
            <button className="error-banner-close" onClick={() => setError("")}>
              ✕
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button className="fleet-btn" onClick={handleSave} disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Add to my Fleet"}
          </button>

          <button
            className="fleet-btn"
            style={{ background: "#555" }}
            onClick={() => navigate("/fleet")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}

export default VehicleDetails;
