import "./Service.css";

import Sidebar from "../components/sidebar";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useState } from "react";

function Service() {

  const [selectedService, setSelectedService] =
    useState(null);

  const services = [

    {
      id: 1,

      name: "Auto Total Service",

      position: [47.0722, 21.9214],

      address: "Calea Aradului 12",

      phone: "+40 721 123 456",

      hours: "08:00 - 18:00",

      description:
        "Complete maintenance and diagnostics service."
    },

    {
      id: 2,

      name: "BMW Service Oradea",

      position: [47.0550, 21.9330],

      address: "Str. Clujului 45",

      phone: "+40 722 654 321",

      hours: "09:00 - 17:00",

      description:
        "Authorized BMW service and premium repairs."
    },

    {
      id: 3,

      name: "Auto Tech Garage",

      position: [47.0645, 21.9011],

      address: "Bd. Decebal 20",

      phone: "+40 745 987 654",

      hours: "08:30 - 19:00",

      description:
        "General mechanics and quick repairs."
    }

  ];

  return (
    <div className="service-page">

      <Sidebar />

      <main className="service-content">

        <div className="service-header">

          <h1>Service Locations</h1>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search..."
            />

            <span>⌕</span>

          </div>

        </div>

        <div className="map-container">

          <MapContainer
            center={[47.0722, 21.9214]}
            zoom={13}
            scrollWheelZoom={true}
            className="leaflet-map"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {services.map((service) => (

              <Marker
                key={service.id}
                position={service.position}
              >

                <Popup>

                  <div className="popup-content">

                    <h3>{service.name}</h3>

                    <p>{service.address}</p>

                    <button
                      onClick={() =>
                        setSelectedService(service)
                      }
                    >
                      View details
                    </button>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

        {/* MODAL */}

        {selectedService && (

          <div className="service-modal-overlay">

            <div className="service-modal">

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedService(null)
                }
              >
                ✕
              </button>

              <h2>
                {selectedService.name}
              </h2>

              <p>
                <strong>Address:  </strong>
                {selectedService.address}
              </p>

              <p>
                <strong>Phone: </strong>
                {selectedService.phone}
              </p>

              <p>
                <strong>Working Hours: </strong>
                {selectedService.hours}
              </p>

              <p>
                <strong>Description: </strong>
                {selectedService.description}
              </p>


            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Service;