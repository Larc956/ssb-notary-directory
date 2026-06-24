"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoreLocation } from "@/lib/types/location";

const DynamicMap = dynamic(
  () => import("./public-map").then((mod) => mod.PublicMap),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[60vh] min-h-[400px] w-full rounded-2xl border border-slate-300" />
  }
);

type PublicMapShellProps = {
  locations: CoreLocation[];
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number]) => void;
  onSelectLocation: (location: CoreLocation) => void; // <-- ADD THIS
};

export function PublicMapShell({ locations, userLocation, setUserLocation, onSelectLocation }: PublicMapShellProps) {
  return (
    <DynamicMap 
      locations={locations} 
      userLocation={userLocation} 
      setUserLocation={setUserLocation} 
      onSelectLocation={onSelectLocation} // <-- ADD THIS
    />
  );
}