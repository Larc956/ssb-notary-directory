"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicAdminMap = dynamic(
  () => import("@/components/map/admin-map").then((mod) => mod.AdminMap),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> }
);

export function SubmitLocationForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Unified form state for clean code
  const [formData, setFormData] = useState({
    name: "", display_name: "", raw_address: "", raw_city: "", raw_landmarks: "",
    office_hours_text: "", contact_numbers_text: "", email: "", facebook_page: "",
    standard_fee_text: "", student_discount_fee_text: "", 
    bulk_discount_min_docs: "", bulk_discount_fee: "", feedback: "",
    accepts_cash: true, accepts_gcash: false, accepts_bank_transfer: false,
    offers_walk_in: true, offers_online: false, offers_courier: false, fee_depends_on_copies: false
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.raw_address || !position) {
      toast.error("Please fill in the name, address, and drop a pin on the map.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting location...", { id: "submit-loc" });

    const { error } = await supabase.from("locations").insert({
      ...formData,
      display_name: formData.display_name || formData.name, // Fallback
      active_latitude: position[0],
      active_longitude: position[1],
      verification_status: "under_review", 
    });

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Failed to submit location.", { id: "submit-loc" });
    } else {
      toast.success("Location submitted! An admin will review it shortly.", { id: "submit-loc" });
      router.push("/"); 
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Office Name *</label>
              <Input value={formData.name} onChange={(e) => updateField("name", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name (Optional)</label>
              <Input value={formData.display_name} onChange={(e) => updateField("display_name", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Address *</label>
              <Input value={formData.raw_address} onChange={(e) => updateField("raw_address", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City / Area</label>
              <Input value={formData.raw_city} onChange={(e) => updateField("raw_city", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nearby Landmarks</label>
              <Input value={formData.raw_landmarks} onChange={(e) => updateField("raw_landmarks", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Contact & Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Office Hours</label>
              <Input value={formData.office_hours_text} onChange={(e) => updateField("office_hours_text", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
              <Input value={formData.contact_numbers_text} onChange={(e) => updateField("contact_numbers_text", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Page</label>
              <Input value={formData.facebook_page} onChange={(e) => updateField("facebook_page", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Fees & Discounts */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Fees & Discounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Standard Fee</label>
              <Input value={formData.standard_fee_text} onChange={(e) => updateField("standard_fee_text", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Discount Fee</label>
              <Input value={formData.student_discount_fee_text} onChange={(e) => updateField("student_discount_fee_text", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bulk Discount Min. Docs</label>
              <Input value={formData.bulk_discount_min_docs} onChange={(e) => updateField("bulk_discount_min_docs", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bulk Discount Fee</label>
              <Input value={formData.bulk_discount_fee} onChange={(e) => updateField("bulk_discount_fee", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Services & Payment Options</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "offers_walk_in", label: "Accepts Walk-ins" },
              { id: "offers_online", label: "Online Services" },
              { id: "offers_courier", label: "Courier/Delivery" },
              { id: "fee_depends_on_copies", label: "Fee depends on copies" },
              { id: "accepts_cash", label: "Accepts Cash" },
              { id: "accepts_gcash", label: "Accepts GCash" },
              { id: "accepts_bank_transfer", label: "Bank Transfer" }
            ].map(toggle => (
              <label key={toggle.id} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData[toggle.id as keyof typeof formData] as boolean} 
                  onChange={(e) => updateField(toggle.id, e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" 
                />
                <span className="text-sm text-slate-700">{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Experience & Notes</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Scholar Feedback</label>
            <Textarea value={formData.feedback} onChange={(e) => updateField("feedback", e.target.value)} className="min-h-[100px]" />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit Location"}
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="space-y-2 sticky top-6">
        <label className="block text-sm font-medium text-slate-700">Pin Location on Map *</label>
        <p className="text-xs text-slate-500 mb-2">Click anywhere to drop a pin.</p>
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <DynamicAdminMap position={position} setPosition={setPosition} />
        </div>
      </div>
    </form>
  );
}