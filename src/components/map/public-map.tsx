"use client";

import "@/components/map/leaflet-marker-fix";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { CoreLocation } from "@/lib/types/location";

type PublicMapProps = {
  locations: CoreLocation[];
};

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export function PublicMap({ locations }: PublicMapProps) {
  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-slate-300">
      <MapContainer
        center={[14.5995, 120.9842]}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <FixMapSize />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="[{s}.tile.openstreetmap.org](https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png)"
        />

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
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{location.display_name}</p>
                  <p className="text-sm text-slate-600">{location.raw_address}</p>
                  {location.standard_fee_text ? (
                    <p className="text-sm">{location.standard_fee_text}</p>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
