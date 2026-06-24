"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { CoreLocation } from "@/lib/types/location";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export function AdminOverviewMap({ locations }: { locations: CoreLocation[] }) {
  // Only map locations that actually have coordinates
  const mappedLocations = locations.filter(
    (loc) => loc.active_latitude !== null && loc.active_longitude !== null
  );

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-slate-300 relative z-0 shadow-sm">
      <MapContainer
        center={[14.5995, 120.9842]} // Default center
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapSize />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappedLocations.map((location) => {
          // Determine Pin Colors based on status
          let borderColor = "#64748b"; // Gray (Unverified)
          let fillColor = "#cbd5e1";
          
          if (location.verification_status === "approved") {
            borderColor = "#16a34a"; // Green
            fillColor = "#4ade80";
          } else if (location.verification_status === "under_review") {
            borderColor = "#dc2626"; // Red
            fillColor = "#f87171";
          }

          return (
            <CircleMarker
              key={location.id}
              center={[location.active_latitude!, location.active_longitude!]}
              radius={8}
              color={borderColor}
              fillColor={fillColor}
              fillOpacity={0.8}
              weight={2}
            >
              <Popup>
                <div className="space-y-2 min-w-[150px]">
                  <p className="font-bold text-sm leading-tight">{location.name}</p>
                  <Badge variant={location.verification_status === "approved" ? "default" : "destructive"} className="text-[10px]">
                    {location.verification_status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline" className="w-full mt-2 h-7" asChild>
                    <Link href={`/admin/location/${location.id}`}>Review / Edit</Link>
                  </Button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}