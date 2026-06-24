"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { notariesData } from "@/data/notaries"; 

const createPin = (status: "Approved" | "Pending") => {
  const color = status === "Approved" ? "#003A6C" : "#ef4444"; 
  
  return L.divIcon({
    className: "custom-pin",
    html: `<div style="
      background-color: ${color}; 
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12], 
  });
};

export default function MapView() {
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

        {notariesData.map((notary) => (
          <Marker 
            key={notary.id} 
            position={[notary.lat, notary.lng]} 
            icon={createPin(notary.status)}
          >
            <Popup className="rounded-xl shadow-xl p-0 custom-popup">
              <div className="flex flex-col gap-2 p-2 w-[280px]">
                {/* Header Section */}
                <div>
                  <h3 className="font-bold text-lg leading-tight text-[#003A6C]">{notary.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{notary.address}</p>
                </div>

                <hr className="border-gray-200" />

                {/* Details Section */}
                <div className="text-sm flex flex-col gap-1">
                  <p><span className="font-semibold text-gray-700">Fee:</span> <span className="text-green-700 font-bold">{notary.fee}</span></p>
                  {notary.hours !== "Not specified" && <p><span className="font-semibold text-gray-700">Hours:</span> {notary.hours}</p>}
                  {notary.contact !== "Not specified" && <p><span className="font-semibold text-gray-700">Contact:</span> {notary.contact}</p>}
                  {notary.landmarks && <p><span className="font-semibold text-gray-700">Landmark:</span> {notary.landmarks}</p>}
                </div>

                {/* Payments Section */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {notary.payments.map(method => (
                    <span key={method} className="px-2 py-0.5 bg-blue-50 text-[#003A6C] border border-blue-200 rounded-md text-xs font-medium">
                      {method}
                    </span>
                  ))}
                </div>

                {/* Scholar Feedback Section */}
                {notary.feedback && (
                  <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded-md">
                    <p className="text-xs font-bold text-yellow-800 mb-1">Scholar Feedback:</p>
                    <p className="text-xs text-yellow-700 italic">"{notary.feedback}"</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}