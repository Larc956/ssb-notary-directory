"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { notariesData } from "@/data/notaries"; // <-- IMPORTING YOUR ACTUAL DATA

const createPin = (status: "Approved" | "Pending") => {
  const color = status === "Approved" ? "#003A6C" : "#ef4444"; 
  
  return L.divIcon({
    className: "custom-pin",
    html: `<div style="
      background-color: ${color}; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10], 
  });
};

export default function MapView() {
  // Centered slightly between Katipunan and Batasan
  const mapCenter: [number, number] = [14.6500, 121.0800]; 

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MAPPING OVER YOUR NEW DATA FILE */}
        {notariesData.map((notary) => (
          <Marker 
            key={notary.id} 
            position={[notary.lat, notary.lng]} 
            icon={createPin(notary.status)}
          >
            <Popup className="rounded-xl shadow-lg">
              <div className="p-1">
                <h3 className="font-bold text-[#003A6C]">{notary.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{notary.address}</p>
                <p className="text-sm font-semibold mt-2">Fee: {notary.fee}</p>
                {notary.status === "Pending" && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    Needs Admin Review
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}