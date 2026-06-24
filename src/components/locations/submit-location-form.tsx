"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [fee, setFee] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !position) {
      toast.error("Please fill in the name, address, and drop a pin on the map.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting location...", { id: "submit-loc" });

    const { error } = await supabase.from("locations").insert({
      name: name,
      display_name: name, // Fallback for display
      raw_address: address,
      standard_fee_text: fee || null,
      active_latitude: position[0],
      active_longitude: position[1],
      verification_status: "under_review", // <--- Crucial: Hides it from the public map!
    });

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Failed to submit location.", { id: "submit-loc" });
    } else {
      toast.success("Location submitted! An admin will review it shortly.", { id: "submit-loc" });
      router.push("/"); // Send them back to the home page
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notary Office Name *</label>
          <Input placeholder="e.g. Ken Notarial Services" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Address *</label>
          <Input placeholder="Include street and city..." value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Standard Fee (Optional)</label>
          <Input placeholder="e.g. ₱150 per document" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>
        <div className="pt-4 border-t border-slate-100">
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Pin Location on Map *</label>
        <p className="text-xs text-slate-500 mb-2">Click anywhere on the map to drop a pin at the exact location.</p>
        <DynamicAdminMap position={position} setPosition={setPosition} />
      </div>
    </form>
  );
}