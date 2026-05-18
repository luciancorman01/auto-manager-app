import "./MyFleet.css";
import Sidebar from "../components/Sidebar";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyFleet() {

  const [cars, setCars] = useState([]);

  useEffect(() => {

    const savedCars =
      JSON.parse(localStorage.getItem("cars")) || [];

    setCars(savedCars);

  }, []);

  return (
    <div className="fleet-page">

      <Sidebar />

      <main className="fleet-content">

        <div className="fleet-header">

          <div>
            <h1>My Fleet</h1>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search vehicle..." />
            <span>⌕</span>
          </div>

        </div>

        <div className="fleet-top">

          <p>
            Total vehicles:
            <span> {cars.length}</span>
          </p>

          <Link to="/vehicle-details">
            <button className="add-btn">
              + Add vehicle
            </button>
          </Link>

        </div>

        <section className="cars-grid">

          {cars.map((car) => (

            <div className="car-card" key={car.id}>

              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
                alt="car"
              />

              <h2>
                {car.make} {car.model}
              </h2>

              <div className="car-details">

                <p>
                  <strong>Year:</strong>
                  {car.year}
                </p>

                <p>
                  <strong>Fuel:</strong>
                  {car.fuel}
                </p>

                <p>
                  <strong>ITP:</strong>
                  {car.itpDate}
                </p>

                <p>
                  <strong>Insurance:</strong>
                  {car.insuranceDate}
                </p>

                <p>
                  <strong>Provider:</strong>
                  {car.insuranceCompany}
                </p>

                <p>
                  <strong>Vignette:</strong>
                  {car.vignetteDate}
                </p>

              </div>

              <Link to="/vehicle-details">

                <button className="details-btn">
                  Edit Details
                </button>

              </Link>

            </div>

          ))}

        </section>

      </main>

    </div>
  );
}

export default MyFleet;