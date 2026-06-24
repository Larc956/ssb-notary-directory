import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { CoreLocation } from "@/lib/types/location";
import { LocationEditForm } from "@/components/admin/location-edit-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

// THIS IS THE MODULE EXPORT THAT NEXT.JS IS LOOKING FOR
export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the data
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error || !locations || locations.length === 0) {
    notFound();
  }

  const location = locations[0] as CoreLocation;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Location</h1>
      <LocationEditForm location={location} />
    </div>
  );
}