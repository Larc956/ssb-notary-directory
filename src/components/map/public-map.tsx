"use client";

import "@/components/map/leaflet-marker-fix";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, CircleMarker } from "react-leaflet";
import type { CoreLocation } from "@/lib/types/location";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "sonner";

type PublicMapProps = {
  locations: CoreLocation[];
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number]) => void;
  onSelectLocation: (location: CoreLocation) => void; // <-- ADD THIS
};

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// 1. Create a custom component for the Locate logic inside the map
function GeolocationControl({ userLoc, setUserLoc }: { userLoc: [number, number] | null, setUserLoc: (loc: [number, number]) => void }) {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.loading("Finding your location...", { id: "locate" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLoc([latitude, longitude]);
        map.flyTo([latitude, longitude], 14, { animate: true }); // Zoom in to level 14
        toast.success("Location found!", { id: "locate" });
      },
      (error) => {
        console.error(error);
        toast.error("Could not access your location. Please check your browser permissions.", { id: "locate" });
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    // z-[400] ensures the button floats securely over the Leaflet map tiles
    <div className="absolute bottom-4 right-4 z-[400]">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-white text-blue-600 hover:bg-slate-50 border border-slate-200"
        onClick={handleLocate}
      >
        <LocateFixed className="h-6 w-6" />
      </Button>
    </div>
  );
}

export function PublicMap({ locations, userLocation, setUserLocation, onSelectLocation }: PublicMapProps) {

  return (
    <div className="h-[60vh] min-h-[400px] w-full overflow-hidden rounded-2xl border border-slate-300 relative z-0 shadow-sm">
      <MapContainer
        center={[14.5995, 120.9842]} // Default center (Manila)
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapSize />
        <GeolocationControl userLoc={userLocation} setUserLoc={setUserLocation} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Notary Pins */}
        {locations
          .filter(
            (location) =>
              location.active_latitude !== null &&
              location.active_longitude !== null
          )
          .map((location) => (
            <Marker
              key={location.id}
              position={[location.active_latitude!, location.active_longitude!]}
              // 2. Add the click event handler here!
              eventHandlers={{
                click: () => onSelectLocation(location),
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{location.display_name}</p>
                  <p className="text-xs text-slate-600">{location.raw_address}</p>
                  {location.standard_fee_text ? (
                    <p className="text-xs font-medium text-blue-700 mt-1">{location.standard_fee_text}</p>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 3. Render a distinct dot for the User's Location */}
        {userLocation && (
          <CircleMarker 
            center={userLocation} 
            radius={8} 
            pathOptions={{ color: "white", fillColor: "#2563eb", fillOpacity: 1, weight: 2 }} 
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}