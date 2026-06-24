"use client";

import { useState, useMemo } from "react";
import type { CoreLocation } from "@/lib/types/location";
import { PublicMapShell } from "@/components/map/public-map-shell";
import { LocationList } from "@/components/locations/location-list";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Wallet, ShieldAlert } from "lucide-react";
import { calculateDistance } from "@/lib/utils";
import { LocationDetailSheet } from "@/components/locations/location-detail-sheet";

const FILTER_OPTIONS = [
  { id: "walk_in", label: "Walk-in Accepted", key: "offers_walk_in" },
  { id: "student_discount", label: "Student Discount", key: "student_discount_available" },
  { id: "gcash", label: "Accepts GCash", key: "accepts_gcash" },
  { id: "online", label: "Online Services", key: "offers_online" },
] as const;

const extractPrice = (text: string | null): number | null => {
  if (!text) return null;
  const matches = text.match(/\d+(?:,\d+)*(?:\.\d+)?/g);
  if (!matches) return null;
  return Math.min(...matches.map(m => parseFloat(m.replace(/,/g, ''))));
};

export function DirectoryView({ initialLocations }: { initialLocations: CoreLocation[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<CoreLocation | null>(null);

  const [maxDistance, setMaxDistance] = useState<number>(50); 
  const [maxPrice, setMaxPrice] = useState<number>(1000); 

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
        if (filterId === "student_discount") {
          const hasBoolean = location.student_discount_available === true;
          const hasText = location.student_discount_fee_text && location.student_discount_fee_text.trim() !== "";
          if (!hasBoolean && !hasText) return false;
        } else {
          const filterDef = FILTER_OPTIONS.find((f) => f.id === filterId);
          if (filterDef && location[filterDef.key as keyof CoreLocation] !== true) {
            return false;
          }
        }
      }

      const price = extractPrice(location.standard_fee_text);
      if (price !== null && maxPrice < 1000 && price > maxPrice) {
        return false;
      }

      if (userLocation && maxDistance < 50) {
        if (!location.active_latitude || !location.active_longitude) {
          return false; 
        }
        const dist = calculateDistance(userLocation[0], userLocation[1], location.active_latitude, location.active_longitude);
        if (dist > maxDistance) {
          return false;
        }
      }

      return true;
    });

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
  }, [initialLocations, searchQuery, activeFilters, userLocation, maxDistance, maxPrice]);

  return (
    <div className="flex flex-col gap-6">
      
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#08415c]/60" />
          <Input
            placeholder="Search by name, address, or city..."
            className="pl-10 bg-white border-[#08415c]/20 focus-visible:ring-[#08415c]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* BRANDED FILTERS */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <Badge
              key={filter.id}
              variant={activeFilters.includes(filter.id) ? "default" : "secondary"}
              className={`cursor-pointer text-sm py-1.5 px-4 transition-all border ${
                activeFilters.includes(filter.id) 
                  ? "bg-[#08415c] text-white hover:bg-[#062f43] shadow-sm border-[#08415c]" 
                  : "bg-white text-[#08415c] hover:bg-slate-50 border-[#08415c]/20"
              }`}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>

        {/* BRANDED SLIDERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-[#08415c]/10 shadow-sm mt-2">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#08415c] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F2A900]" />
                Maximum Distance
              </label>
              <span className="text-xs font-bold text-[#08415c] bg-[#08415c]/5 px-2 py-1 rounded-md border border-[#08415c]/10">
                {maxDistance >= 50 ? "Any distance" : `Within ${maxDistance} km`}
              </span>
            </div>
            <input
              type="range" min="1" max="50" step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              disabled={!userLocation}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer outline-none ${userLocation ? 'bg-[#08415c]/20 accent-[#08415c]' : 'bg-slate-100 accent-slate-300 cursor-not-allowed'}`}
            />
            {!userLocation && (
              <p className="text-xs text-[#F2A900] font-semibold flex items-center gap-1.5 mt-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Please allow location access to filter by distance.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#08415c] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#F2A900]" />
                Maximum Price
              </label>
              <span className="text-xs font-bold text-[#08415c] bg-[#08415c]/5 px-2 py-1 rounded-md border border-[#08415c]/10">
                {maxPrice >= 1000 ? "Any price" : `Up to ₱${maxPrice}`}
              </span>
            </div>
            <input
              type="range" min="50" max="1000" step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none bg-[#F2A900]/30 accent-[#F2A900]"
            />
          </div>

        </div>
      </div>

      <p className="text-sm font-medium text-[#08415c]/70">
        Showing {filteredLocations.length} location{filteredLocations.length !== 1 && "s"}
      </p>

      <PublicMapShell 
        locations={filteredLocations} 
        userLocation={userLocation} 
        setUserLocation={setUserLocation}
        onSelectLocation={setSelectedLocation} 
      />

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#08415c]">Nearby locations</h2>
        <LocationList 
          locations={filteredLocations} 
          userLocation={userLocation} 
          onSelectLocation={setSelectedLocation} 
        />
      </section>

      <LocationDetailSheet 
        location={selectedLocation} 
        onClose={() => setSelectedLocation(null)} 
      />
    </div>
  );
}