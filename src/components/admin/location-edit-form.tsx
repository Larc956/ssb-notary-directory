"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CoreLocation } from "@/lib/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, MapPinOff } from "lucide-react";

const DynamicAdminMap = dynamic(
  () => import("@/components/map/admin-map").then((mod) => mod.AdminMap),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> }
);

export function LocationEditForm({ location }: { location: CoreLocation }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const hasAttemptedEstimate = useRef(false);

  const [name, setName] = useState(location.name || "");
  const [status, setStatus] = useState(location.verification_status || "unverified");
  const [position, setPosition] = useState<[number, number] | null>(
    location.active_latitude && location.active_longitude
      ? [location.active_latitude, location.active_longitude]
      : null
  );

  const estimateLocation = async () => {
    if (!location.raw_address) return;
    
    setIsEstimating(true);
    toast.loading("Searching for address coordinates...", { id: "geocode" });
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location.raw_address)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        toast.success("Estimated location found! Please drag the pin to the exact doorway.", { id: "geocode" });
      } else {
        toast.error("Address too vague to auto-locate. Please manually click the map to place the pin.", { id: "geocode" });
      }
    } catch (err) {
      toast.error("Network error while estimating location.", { id: "geocode" });
    }
    
    setIsEstimating(false);
  };

  useEffect(() => {
    if (!position && location.raw_address && !hasAttemptedEstimate.current) {
      hasAttemptedEstimate.current = true;
      estimateLocation();
    }
  }, [position, location.raw_address]);

  const handleSave = async () => {
    if (!location.id) {
      toast.error("Error: Missing location ID.");
      return;
    }

    setIsSaving(true);
    toast.loading("Saving changes...", { id: "save-loc" });

    // FIX: Ensure the row update targets the specific ID unambiguously
    const { error } = await supabase
      .from("locations")
      .update({
        name,
        verification_status: status,
        active_latitude: position ? position[0] : null,
        active_longitude: position ? position[1] : null,
      })
      .eq("id", location.id);

    setIsSaving(false);

    if (error) {
      console.error("Supabase update error:", error);
      toast.error(`Failed to save changes: ${error.message}`, { id: "save-loc" });
    } else {
      toast.success("Location updated successfully!", { id: "save-loc" });
      router.push("/admin"); 
      router.refresh(); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Office Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Verification Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as CoreLocation["verification_status"])}
            className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            <option value="approved">Approved (Visible on Map)</option>
            <option value="under_review">Under Review</option>
            <option value="unverified">Unverified</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100 flex-1">
          <p className="text-sm text-slate-500 mb-2">Original Raw Address from Import:</p>
          <p className="text-sm font-medium bg-slate-50 p-3 rounded-md border border-slate-200">{location.raw_address || "No address provided"}</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={estimateLocation} 
            disabled={isEstimating}
            className="mt-3 text-slate-600 w-full"
          >
            {isEstimating ? "Searching..." : "Re-Estimate from Address"}
          </Button>
        </div>

        <div className="pt-4 flex gap-3 border-t border-slate-100">
          <Button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin")} className="w-full">
            Cancel
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="block text-sm font-medium text-slate-700">Pin Location</label>
          {position ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <MapPinOff className="w-3.5 h-3.5" />
              Coordinates Missing
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-2">
          If the estimation is slightly off, drag the pin to adjust it to the exact entrance.
        </p>
        <DynamicAdminMap position={position} setPosition={setPosition} />
      </div>
    </div>
  );
}