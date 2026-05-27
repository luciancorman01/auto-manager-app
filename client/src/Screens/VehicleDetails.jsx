import "./VehicleDetails.css";
import Sidebar from "../components/Sidebar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Select from "react-select";

import api from "../api";

function VehicleDetails() {

  const navigate = useNavigate();

  const [marca, setMarca] = useState("");
  const [model, setModel] = useState("");

  const [nrInmatriculare, setNrInmatriculare] =
    useState("");

  const [vin, setVin] = useState("");

  const [anFabricatie, setAnFabricatie] =
    useState("");

  const [insuranceDate, setInsuranceDate] =
    useState("");

  const [insuranceCompany, setInsuranceCompany] =
    useState("");

  const [itpDate, setItpDate] =
    useState("");

  const [vignetteDate, setVignetteDate] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
      "Jetta"
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
      "TT"
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
      "M5"
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
      "AMG GT"
    ],

    Dacia: [
      "Logan",
      "Duster",
      "Sandero",
      "Spring",
      "Jogger"
    ],

    Tesla: [
      "Model 3",
      "Model S",
      "Model X",
      "Model Y",
      "Cybertruck"
    ],

    Porsche: [
      "911",
      "Cayenne",
      "Panamera",
      "Macan",
      "Taycan"
    ],

    Ford: [
      "Fiesta",
      "Focus",
      "Mondeo",
      "Kuga",
      "Puma",
      "Mustang",
      "Ranger"
    ],

    Toyota: [
      "Corolla",
      "Camry",
      "Yaris",
      "RAV4",
      "Land Cruiser",
      "Prius",
      "Supra"
    ],

    Renault: [
      "Clio",
      "Megane",
      "Talisman",
      "Kadjar",
      "Captur"
    ],

    Peugeot: [
      "208",
      "308",
      "508",
      "2008",
      "3008",
      "5008"
    ],

    Skoda: [
      "Fabia",
      "Octavia",
      "Superb",
      "Kodiaq",
      "Kamiq"
    ],

    Seat: [
      "Ibiza",
      "Leon",
      "Ateca",
      "Arona",
      "Tarraco"
    ],

    Hyundai: [
      "i20",
      "i30",
      "Tucson",
      "Santa Fe",
      "Kona"
    ],

    Kia: [
      "Ceed",
      "Sportage",
      "Sorento",
      "Stinger",
      "Picanto"
    ],

    Opel: [
      "Corsa",
      "Astra",
      "Insignia",
      "Mokka",
      "Crossland"
    ],

    Nissan: [
      "Micra",
      "Juke",
      "Qashqai",
      "X-Trail",
      "370Z"
    ],

    Honda: [
      "Civic",
      "Accord",
      "CR-V",
      "HR-V"
    ],

    Mazda: [
      "Mazda 2",
      "Mazda 3",
      "Mazda 6",
      "CX-3",
      "CX-5"
    ],

    Volvo: [
      "S60",
      "S90",
      "XC40",
      "XC60",
      "XC90"
    ],

    Lexus: [
      "IS",
      "ES",
      "RX",
      "NX",
      "UX"
    ],

    Ferrari: [
      "488 GTB",
      "F8",
      "Roma",
      "SF90"
    ],

    Lamborghini: [
      "Huracan",
      "Aventador",
      "Urus"
    ],

    Bentley: [
      "Bentayga",
      "Continental GT",
      "Flying Spur"
    ],

    "Rolls Royce": [
      "Ghost",
      "Phantom",
      "Cullinan"
    ]

  };

  const years = Array.from(
    { length: 40 },
    (_, i) => 2026 - i
  );

  const customStyles = {

    control: (provided) => ({
      ...provided,

      background: "#666a80",

      border: "none",

      borderRadius: "18px",

      minHeight: "46px",

      boxShadow: "none",

      paddingLeft: "6px"
    }),

    menu: (provided) => ({
      ...provided,

      background: "#666a80",

      borderRadius: "18px",

      overflow: "hidden"
    }),

    option: (provided, state) => ({
      ...provided,

      background: state.isFocused
        ? "#7d82a5"
        : "#666a80",

      color: "white",

      cursor: "pointer"
    }),

    singleValue: (provided) => ({
      ...provided,

      color: "white"
    }),

    placeholder: (provided) => ({
      ...provided,

      color: "white"
    })

  };

  const handleAddVehicle = async () => {

    setError("");

    if (
      !marca ||
      !model ||
      !nrInmatriculare ||
      !vin ||
      !anFabricatie
    ) {

      setError(
        "Marca, model, nr. înmatriculare, VIN și an fabricație sunt obligatorii."
      );

      return;
    }

    setLoading(true);

    try {

      const vehicleRes =
        await api.post("/vehicles", {

          marca,
          model,

          nr_inmatriculare:
            nrInmatriculare,

          vin,

          an_fabricatie:
            Number(anFabricatie),

        });

      const vehicleId =
        vehicleRes.data.vehicle.id;

      const documentPromises = [];

      if (insuranceDate) {

        documentPromises.push(

          api.post(
            `/vehicles/${vehicleId}/documents`,
            {

              tip: "RCA",

              data_expirare:
                insuranceDate,

              companie:
                insuranceCompany || null,

            }
          )

        );
      }

      if (itpDate) {

        documentPromises.push(

          api.post(
            `/vehicles/${vehicleId}/documents`,
            {

              tip: "ITP",

              data_expirare:
                itpDate,

            }
          )

        );
      }

      if (vignetteDate) {

        documentPromises.push(

          api.post(
            `/vehicles/${vehicleId}/documents`,
            {

              tip: "Rovinieta",

              data_expirare:
                vignetteDate,

            }
          )

        );
      }

      await Promise.all(documentPromises);

      navigate("/fleet");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Eroare la salvarea vehiculului."
      );

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

            <input
              type="text"
              placeholder="Search..."
            />

            <span>⌕</span>

          </div>

        </div>

        <section className="car-details-box">

          <h2>Car details</h2>

          <div className="car-selects">

            <Select
              options={Object.keys(carModels).map((brand) => ({
                value: brand,
                label: brand
              }))}

              placeholder="Select make"

              value={
                marca
                  ? {
                      value: marca,
                      label: marca
                    }
                  : null
              }

              onChange={(selected) => {
                setMarca(selected.value);
                setModel("");
              }}

              styles={customStyles}
            />

            <Select
              options={
                marca
                  ? carModels[marca].map((carModel) => ({
                      value: carModel,
                      label: carModel
                    }))
                  : []
              }

              placeholder="Select model"

              value={
                model
                  ? {
                      value: model,
                      label: model
                    }
                  : null
              }

              onChange={(selected) =>
                setModel(selected.value)
              }

              styles={customStyles}
            />

            <Select
              options={years.map((year) => ({
                value: year,
                label: year
              }))}

              placeholder="Select year"

              value={
                anFabricatie
                  ? {
                      value: anFabricatie,
                      label: anFabricatie
                    }
                  : null
              }

              onChange={(selected) =>
                setAnFabricatie(selected.value)
              }

              styles={customStyles}
            />

          </div>

          <div
            className="car-selects"
            style={{ marginTop: "12px" }}
          >

            <input
              type="text"
              placeholder="Nr. înmatriculare (ex: BH 01 ABC)"
              value={nrInmatriculare}
              onChange={(e) =>
                setNrInmatriculare(
                  e.target.value.toUpperCase()
                )
              }
            />

            <input
              type="text"
              placeholder="VIN (17 caractere)"
              value={vin}
              onChange={(e) =>
                setVin(
                  e.target.value.toUpperCase()
                )
              }

              maxLength={17}
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
              onChange={(e) =>
                setInsuranceDate(e.target.value)
              }
            />

            <label>Insurance Company</label>

            <input
              type="text"
              value={insuranceCompany}
              onChange={(e) =>
                setInsuranceCompany(e.target.value)
              }
            />

          </div>

          <div className="doc-card">

            <h3>ITP</h3>

            <label>Expires in</label>

            <input
              type="date"
              value={itpDate}
              onChange={(e) =>
                setItpDate(e.target.value)
              }
            />

          </div>

          <div className="doc-card">

            <h3>Rovinieta</h3>

            <label>Expires in</label>

            <input
              type="date"
              value={vignetteDate}
              onChange={(e) =>
                setVignetteDate(e.target.value)
              }
            />

          </div>

        </section>

        {error && (

          <p
            className="error-message"
            style={{
              color: "red",
              marginBottom: "12px"
            }}
          >
            {error}
          </p>

        )}

        <button
          className="fleet-btn"
          onClick={handleAddVehicle}
          disabled={loading}
        >

          {loading
            ? "Se salvează..."
            : "Add to my Fleet"}

        </button>

      </main>

    </div>
  );
}

export default VehicleDetails;