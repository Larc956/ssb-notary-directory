"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CoreLocation } from "@/lib/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const [position, setPosition] = useState<[number, number] | null>(
    location.active_latitude && location.active_longitude
      ? [location.active_latitude, location.active_longitude]
      : null
  );

  // Initialize unified state from database
  const [formData, setFormData] = useState({
    name: location.name || "",
    display_name: location.display_name || "",
    raw_address: location.raw_address || "",
    raw_city: location.raw_city || "",
    raw_landmarks: location.raw_landmarks || "",
    office_hours_text: location.office_hours_text || "",
    contact_numbers_text: location.contact_numbers_text || "",
    email: location.email || "",
    facebook_page: location.facebook_page || "",
    standard_fee_text: location.standard_fee_text || "",
    student_discount_fee_text: location.student_discount_fee_text || "",
    bulk_discount_min_docs: location.bulk_discount_min_docs || "",
    bulk_discount_fee: location.bulk_discount_fee || "",
    feedback: location.feedback || "",
    verification_notes: location.verification_notes || "",
    verification_status: location.verification_status || "unverified",
    accepts_cash: !!location.accepts_cash,
    accepts_gcash: !!location.accepts_gcash,
    accepts_bank_transfer: !!location.accepts_bank_transfer,
    offers_walk_in: !!location.offers_walk_in,
    offers_online: !!location.offers_online,
    offers_courier: !!location.offers_courier,
    fee_depends_on_copies: !!location.fee_depends_on_copies,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const estimateLocation = async () => {
    if (!formData.raw_address) return;
    setIsEstimating(true);
    toast.loading("Searching for address...", { id: "geocode" });
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(formData.raw_address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        toast.success("Estimated location found!", { id: "geocode" });
      } else {
        toast.error("Address too vague to auto-locate.", { id: "geocode" });
      }
    } catch {
      toast.error("Network error while estimating.", { id: "geocode" });
    }
    setIsEstimating(false);
  };

  useEffect(() => {
    if (!position && formData.raw_address && !hasAttemptedEstimate.current) {
      hasAttemptedEstimate.current = true;
      estimateLocation();
    }
  }, [position, formData.raw_address]);

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading("Saving changes...", { id: "save-loc" });

    const { error } = await supabase
      .from("locations")
      .update({
        ...formData,
        active_latitude: position ? position[0] : null,
        active_longitude: position ? position[1] : null,
      })
      .eq("id", location.id);

    setIsSaving(false);

    if (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`, { id: "save-loc" });
    } else {
      toast.success("Location updated successfully!", { id: "save-loc" });
      router.push("/admin"); 
      router.refresh(); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Admin Controls */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Admin Controls</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Verification Status</label>
            <select 
              value={formData.verification_status} 
              onChange={(e) => updateField("verification_status", e.target.value)}
              className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="approved">Approved (Visible on Map)</option>
              <option value="under_review">Under Review</option>
              <option value="unverified">Unverified</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Internal Verification Notes</label>
            <Textarea value={formData.verification_notes} onChange={(e) => updateField("verification_notes", e.target.value)} />
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium mb-1">Name</label><Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Display Name</label><Input value={formData.display_name} onChange={(e) => updateField("display_name", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="block text-xs font-medium mb-1">Raw Address</label><Input value={formData.raw_address} onChange={(e) => updateField("raw_address", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">City</label><Input value={formData.raw_city} onChange={(e) => updateField("raw_city", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Landmarks</label><Input value={formData.raw_landmarks} onChange={(e) => updateField("raw_landmarks", e.target.value)} /></div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium mb-1">Hours</label><Input value={formData.office_hours_text} onChange={(e) => updateField("office_hours_text", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Phone</label><Input value={formData.contact_numbers_text} onChange={(e) => updateField("contact_numbers_text", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Email</label><Input value={formData.email} onChange={(e) => updateField("email", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Facebook</label><Input value={formData.facebook_page} onChange={(e) => updateField("facebook_page", e.target.value)} /></div>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium mb-1">Standard Fee</label><Input value={formData.standard_fee_text} onChange={(e) => updateField("standard_fee_text", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Student Fee</label><Input value={formData.student_discount_fee_text} onChange={(e) => updateField("student_discount_fee_text", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Bulk Min Docs</label><Input value={formData.bulk_discount_min_docs} onChange={(e) => updateField("bulk_discount_min_docs", e.target.value)} /></div>
            <div><label className="block text-xs font-medium mb-1">Bulk Fee</label><Input value={formData.bulk_discount_fee} onChange={(e) => updateField("bulk_discount_fee", e.target.value)} /></div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Toggles</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "offers_walk_in", label: "Walk-ins" },
              { id: "offers_online", label: "Online" },
              { id: "offers_courier", label: "Courier" },
              { id: "fee_depends_on_copies", label: "Fee depends on copies" },
              { id: "accepts_cash", label: "Cash" },
              { id: "accepts_gcash", label: "GCash" },
              { id: "accepts_bank_transfer", label: "Bank Transfer" }
            ].map(toggle => (
              <label key={toggle.id} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData[toggle.id as keyof typeof formData] as boolean} 
                  onChange={(e) => updateField(toggle.id, e.target.checked)} 
                  className="w-4 h-4 rounded text-blue-600" 
                />
                <span className="text-sm text-slate-700">{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">User Feedback</h3>
          <Textarea value={formData.feedback} onChange={(e) => updateField("feedback", e.target.value)} className="min-h-[80px]" />
        </div>

        <div className="pt-6 border-t flex gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin")} className="w-full">Cancel</Button>
        </div>
      </div>

      <div className="space-y-2 sticky top-6">
        <div className="flex justify-between items-end">
          <label className="block text-sm font-medium text-slate-700">Pin Location</label>
          {position ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"><MapPin className="w-3.5 h-3.5" /> Set</div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium"><MapPinOff className="w-3.5 h-3.5" /> Missing</div>
          )}
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <DynamicAdminMap position={position} setPosition={setPosition} />
        </div>
        <Button variant="outline" size="sm" onClick={estimateLocation} disabled={isEstimating} className="w-full text-slate-600">
          {isEstimating ? "Searching..." : "Re-Estimate Map Pin from Address"}
        </Button>
      </div>
    </div>
  );
}