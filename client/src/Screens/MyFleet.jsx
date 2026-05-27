import "./MyFleet.css";
import Sidebar from "../components/sidebar";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { findDocument, formatExpiryDate } from "../utils/documents";
import carPlaceholder from "../assets/car-placeholder.svg";

function MyFleet() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselIndexByCar, setCarouselIndexByCar] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/vehicles");
        setCars(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Nu s-au putut încărca vehiculele.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getPhotoUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000"}${imageUrl}`;
  };

  const getDisplayPhoto = (car) => {
    const photos = car.photos || [];
    if (photos.length === 0) return carPlaceholder;
    const currentIndex = carouselIndexByCar[car.id] || 0;
    const safeIndex = Math.max(0, Math.min(currentIndex, photos.length - 1));
    return getPhotoUrl(photos[safeIndex].image_url);
  };

  const moveCarousel = (carId, photosCount, direction) => {
    if (!photosCount) return;
    setCarouselIndexByCar((prev) => {
      const current = prev[carId] || 0;
      const next = (current + direction + photosCount) % photosCount;
      return { ...prev, [carId]: next };
    });
  };

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
            <button className="add-btn">+ Add vehicle</button>
          </Link>
        </div>

        {loading && <p>Loading fleet...</p>}
        {error && <p className="error-message">{error}</p>}

        <section className="cars-grid">
          {cars.map((car) => {
            const rca = findDocument(car.documents, "RCA");
            const itp = findDocument(car.documents, "ITP");
            const rovinieta = findDocument(car.documents, "Rovinieta");

            return (
              <div className="car-card" key={car.id}>
                <img src={getDisplayPhoto(car)} alt="car" />
                {(car.photos?.length || 0) > 1 && (
                  <div className="carousel-controls">
                    <button
                      onClick={() =>
                        moveCarousel(car.id, car.photos.length, -1)
                      }
                    >
                      ‹
                    </button>
                    <span>
                      {(carouselIndexByCar[car.id] || 0) + 1} /{" "}
                      {car.photos.length}
                    </span>
                    <button
                      onClick={() => moveCarousel(car.id, car.photos.length, 1)}
                    >
                      ›
                    </button>
                  </div>
                )}

                <h2>
                  {car.marca} {car.model}
                </h2>

                <div className="car-details">
                  <p>
                    <strong>Year:</strong> {car.an_fabricatie}
                  </p>

                  <p>
                    <strong>Plate:</strong> {car.nr_inmatriculare}
                  </p>

                  <p>
                    <strong>ITP:</strong> {formatExpiryDate(itp?.data_expirare)}
                  </p>

                  <p>
                    <strong>Insurance:</strong>{" "}
                    {formatExpiryDate(rca?.data_expirare)}
                  </p>

                  <p>
                    <strong>Provider:</strong> {rca?.companie || "—"}
                  </p>

                  <p>
                    <strong>Vignette:</strong>{" "}
                    {formatExpiryDate(rovinieta?.data_expirare)}
                  </p>
                </div>

                <div className="car-card-actions">
                  <Link to={`/vehicle-details/${car.id}`}>
                    <button className="details-btn">Edit Details</button>
                  </Link>
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
