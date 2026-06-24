"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // CRITICAL: This styles the map!
import L from "leaflet";

// Our custom map pins (Bypasses the Next.js missing image bug)
const createPin = (status: "Approved" | "Pending") => {
  const color = status === "Approved" ? "#003A6C" : "#ef4444"; // Brand Blue vs Red
  
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
    iconAnchor: [10, 10], // Centers the pin exactly on the coordinate
  });
};

// Temporary mock data (We will replace this with your geocoded CSV data later)
const mockNotaries = [
  {
    id: 1,
    name: "Arceo & Tandoc Law Firm",
    lat: 14.6360,
    lng: 121.0735,
    fee: "₱1000",
    status: "Approved" as const,
  },
  {
    id: 2,
    name: "Ken Notarial Services",
    lat: 14.6946,
    lng: 121.0965,
    fee: "₱100-150",
    status: "Approved" as const,
  },
  {
    id: 3,
    name: "Community Submitted Location",
    lat: 14.6400,
    lng: 121.0750,
    fee: "Unknown",
    status: "Pending" as const, // This will render as a red pin!
  }
];

export default function MapView() {
  // Coordinates centering on the QC/Loyola Heights area
  const mapCenter: [number, number] = [14.6500, 121.0800]; 

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        {/* The underlying street map layer (Free OpenStreetMap tiles) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Loop through our data and render pins */}
        {mockNotaries.map((notary) => (
          <Marker 
            key={notary.id} 
            position={[notary.lat, notary.lng]} 
            icon={createPin(notary.status)}
          >
            <Popup className="rounded-xl shadow-lg">
              <div className="p-1">
                <h3 className="font-bold text-brand-blue">{notary.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Fee: {notary.fee}</p>
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