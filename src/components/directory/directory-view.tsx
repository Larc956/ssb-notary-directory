"use client";

import { useState, useMemo } from "react";
import type { CoreLocation } from "@/lib/types/location";
import { PublicMapShell } from "@/components/map/public-map-shell";
import { LocationList } from "@/components/locations/location-list";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { calculateDistance } from "@/lib/utils";
import { LocationDetailSheet } from "@/components/locations/location-detail-sheet";

type DirectoryViewProps = {
  initialLocations: CoreLocation[];
};

const FILTER_OPTIONS = [
  { id: "walk_in", label: "Walk-in Accepted", key: "offers_walk_in" },
  { id: "student_discount", label: "Student Discount", key: "student_discount_available" },
  { id: "gcash", label: "Accepts GCash", key: "accepts_gcash" },
  { id: "online", label: "Online Services", key: "offers_online" },
] as const;


export function DirectoryView({ initialLocations }: DirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // 1. Create a state to track the clicked location
  const [selectedLocation, setSelectedLocation] = useState<CoreLocation | null>(null);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const filteredLocations = useMemo(() => {
    let results = initialLocations.filter((location) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        location.name.toLowerCase().includes(searchLower) ||
        (location.branch_name?.toLowerCase() || "").includes(searchLower) ||
        location.raw_address.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      for (const filterId of activeFilters) {
        const filterDef = FILTER_OPTIONS.find((f) => f.id === filterId);
        if (filterDef && location[filterDef.key as keyof CoreLocation] !== true) {
          return false;
        }
      }
      return true;
    });

    // NEW: If we have the user's location, sort the results closest to farthest
    if (userLocation) {
      results.sort((a, b) => {
        if (!a.active_latitude || !a.active_longitude) return 1;
        if (!b.active_latitude || !b.active_longitude) return -1;
        
        const distA = calculateDistance(userLocation[0], userLocation[1], a.active_latitude, a.active_longitude);
        const distB = calculateDistance(userLocation[0], userLocation[1], b.active_latitude, b.active_longitude);
        return distA - distB;
      });
    }

    return results;
  }, [initialLocations, searchQuery, activeFilters, userLocation]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by name, address, or city..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <Badge
              key={filter.id}
              variant={activeFilters.includes(filter.id) ? "default" : "secondary"}
              className="cursor-pointer text-sm py-1.5 px-3 transition-colors"
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-slate-600">
        Showing {filteredLocations.length} location{filteredLocations.length !== 1 && "s"}
      </p>

      {/* Pass the state down as props */}
      <PublicMapShell 
        locations={filteredLocations} 
        userLocation={userLocation} 
        setUserLocation={setUserLocation}
        onSelectLocation={setSelectedLocation} /* <--- ADD THIS LINE */
      />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Nearby locations</h2>
        {/* 2. Pass the setter to the LocationList */}
        <LocationList 
          locations={filteredLocations} 
          userLocation={userLocation} 
          onSelectLocation={setSelectedLocation} 
        />
      </section>

      {/* 3. Add the invisible sheet component to the bottom */}
      <LocationDetailSheet 
        location={selectedLocation} 
        onClose={() => setSelectedLocation(null)} 
      />
    </div>
  );
}