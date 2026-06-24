import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { CoreLocation } from "@/lib/types/location";
import { LocationEditForm } from "@/components/admin/location-edit-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LocationEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the specific location
  const { data: location, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !location) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Edit Location</h2>
            <p className="text-slate-500">
              Modifying details for: <span className="font-semibold text-slate-700">{location.name}</span>
            </p>
          </div>
        </div>
        <LocationEditForm location={location as CoreLocation} />
      </div>
    </main>
  );
}