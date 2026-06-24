import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { CoreLocation } from "@/lib/types/location";
import { LocationEditForm } from "@/components/admin/location-edit-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// This type definition is required for Next.js 15+ dynamic routes
type PageProps = {
  params: Promise<{ id: string }>;
};

// THIS EXPORT IS MANDATORY to treat this file as a module (React Component)
export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the data
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .limit(1);

  // Handle data not found or database errors
  if (error || !locations || locations.length === 0) {
    notFound();
  }

  const location = locations[0] as CoreLocation;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Location
            </h2>
            <p className="text-slate-500">
              Adjust details and coordinates for: <span className="font-semibold text-slate-700">{location.name}</span>
            </p>
          </div>
        </div>

        <LocationEditForm location={location} />
      </div>
    </main>
  );
}