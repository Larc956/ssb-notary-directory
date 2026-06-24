"use client";

import "@/components/map/leaflet-marker-fix";
import { useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";

type AdminMapProps = {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
};

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function ClickToPlace({ setPosition }: { setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// NEW: This forces the map to smoothly pan to the new coordinates when the estimation finishes
function CenterMapOnPosition({ position }: { position: [number, number] | null }) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    // Only fly if we have a position and haven't centered yet
    if (position && !hasCentered.current) {
      map.flyTo(position, 15, { animate: true });
      hasCentered.current = true;
    }
  }, [position, map]);
  
  return null;
}

export function AdminMap({ position, setPosition }: AdminMapProps) {
  const markerRef = useRef<LeafletMarker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        }
      },
    }),
    [setPosition]
  );

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-slate-300 relative z-0 shadow-sm">
      <MapContainer
        center={position || [14.64, 121.05]} 
        zoom={position ? 15 : 11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapSize />
        <ClickToPlace setPosition={setPosition} />
        <CenterMapOnPosition position={position} /> {/* <-- Added here */}

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          />
        )}
      </MapContainer>
    </div>
  );
}