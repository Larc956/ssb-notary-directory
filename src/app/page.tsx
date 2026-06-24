import { createClient } from "@/lib/supabase/server";
import { DirectoryView } from "@/components/directory/directory-view";
import type { CoreLocation } from "@/lib/types/location";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  // 1. Initialize the Supabase server client
  const supabase = await createClient();

  // 2. Fetch all approved locations
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .eq("verification_status", "approved");

  if (error) {
    console.error("Error fetching locations:", error);
  }

  // 3. Fallback to an empty array if there's an error
  const safeLocations = (locations as CoreLocation[]) || [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <section className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              SSB Notary Directory
            </h1>
            <p className="max-w-2xl text-slate-600">
              Find nearby notary public offices with student-friendly information.
            </p>
          </section>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Link href="/submit">Add a Location</Link>
          </Button>
        </div>
        
        {/* Interactive Directory */}
        <DirectoryView initialLocations={safeLocations} />
      </div>
    </main>
  );
}