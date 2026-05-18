import "./VehicleDetails.css";
import Sidebar from "../components/Sidebar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VehicleDetails() {

  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");

  const [insuranceDate, setInsuranceDate] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");

  const [itpDate, setItpDate] = useState("");
  const [serviceName, setServiceName] = useState("");

  const [vignetteDate, setVignetteDate] = useState("");
  const [country, setCountry] = useState("");

  const carModels = {

    Volkswagen: [
      "Golf 7",
      "Passat",
      "Arteon",
      "Tiguan"
    ],

    Audi: [
      "A4",
      "A6",
      "Q5",
      "Q7"
    ],

    BMW: [
      "320d",
      "520d",
      "X5"
    ],

    Mercedes: [
      "C Class",
      "E Class",
      "GLE"
    ],

    Dacia: [
      "Logan",
      "Duster",
      "Sandero"
    ],

    Tesla: [
      "Model 3",
      "Model S",
      "Model X"
    ]
  };

  const handleAddVehicle = () => {

    const newCar = {
      id: Date.now(),

      make,
      model,
      year,
      fuel,

      insuranceDate,
      insuranceCompany,

      itpDate,
      serviceName,

      vignetteDate,
      country,
    };

    const existingCars =
      JSON.parse(localStorage.getItem("cars")) || [];

    existingCars.push(newCar);

    localStorage.setItem(
      "cars",
      JSON.stringify(existingCars)
    );

    navigate("/fleet");
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

            {/* MAKE */}

            <select
              value={make}
              onChange={(e) => {

                setMake(e.target.value);

                setModel("");
              }}
            >

              <option value="">
                Select make
              </option>

              {Object.keys(carModels).map((brand) => (

                <option
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>

              ))}

            </select>

            {/* MODEL */}

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >

              <option value="">
                Select model
              </option>

              {make &&
                carModels[make].map((carModel) => (

                  <option
                    key={carModel}
                    value={carModel}
                  >
                    {carModel}
                  </option>

                ))}

            </select>

            {/* YEAR */}

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">
                Select year
              </option>

              <option value="2020">
                2020
              </option>

              <option value="2021">
                2021
              </option>

              <option value="2022">
                2022
              </option>

              <option value="2023">
                2023
              </option>

              <option value="2024">
                2024
              </option>
            </select>

            {/* FUEL */}

            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            >

              <option value="">
                Select fuel
              </option>

              <option value="Diesel">
                Diesel
              </option>

              <option value="Petrol">
                Petrol
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

              <option value="Electric">
                Electric
              </option>

            </select>

          </div>

        </section>

        {/* DOCUMENTS */}

        <section className="documents-grid">

          {/* INSURANCE */}

          <div className="doc-card">

            <h3>Insurance</h3>

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

          {/* ITP */}

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

            <label>Service Name</label>

            <input
              type="text"
              value={serviceName}
              onChange={(e) =>
                setServiceName(e.target.value)
              }
            />

          </div>

          {/* VIGNETTE */}

          <div className="doc-card">

            <h3>Vigneta</h3>

            <label>Expires in</label>

            <input
              type="date"
              value={vignetteDate}
              onChange={(e) =>
                setVignetteDate(e.target.value)
              }
            />

            <label>Country</label>

            <input
              type="text"
              value={country}
              onChange={(e) =>
                setCountry(e.target.value)
              }
            />

          </div>

        </section>

        <button
          className="fleet-btn"
          onClick={handleAddVehicle}
        >
          Add to my Fleet
        </button>

      </main>

    </div>
  );
}

export default VehicleDetails;