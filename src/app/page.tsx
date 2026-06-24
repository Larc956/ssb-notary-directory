import { createClient } from "@/lib/supabase/server";
import { DirectoryView } from "@/components/directory/directory-view";
import type { CoreLocation } from "@/lib/types/location";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch only approved locations for the public directory
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .eq("verification_status", "approved");

  if (error) {
    console.error("Error fetching locations:", error);
  }

  const safeLocations = (locations as CoreLocation[]) || [];

  return (
    <main className="relative min-h-screen bg-[#08415c] overflow-hidden selection:bg-[#F2A900]/30 pb-20">
      
      {/* Soft Golden Bubble Gradients */}
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#F2A900]/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-[30%] -right-[20%] w-[50%] h-[70%] rounded-full bg-[#F2A900]/10 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-[#F2A900]/15 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 md:pt-16 flex flex-col gap-10">

        {/* BRANDING HEADER */}
        <header className="flex flex-col items-center text-center space-y-5">
          {/* Logo Container (Floating Transparent) */}
          <div className="w-30 h-30 md:w-36 md:h-36 flex items-center justify-center relative drop-shadow-[0_0_15px_rgba(242,169,0,0.4)]">
            <img
              src="/ssb-logo.png" 
              alt="SSB Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title & Motto */}
          <div className="space-y-2 -mt-10 md:-mt-6 relative z-20">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md"
              style={{ fontFamily: "'Garet', sans-serif" }}
            >
              {"Scholars' Sectoral Board"}
            </h1>
            <p 
              className="text-xl md:text-5xl lg:text-4xl text-white font-bold italic tracking-wider lowercase drop-shadow-sm"
              style={{ fontFamily: "'Garet', sans-serif" }}
            >
              {`lagi't lagi para sa sektor`}
            </p>
          </div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Official Notary Public Directory. Find verified, affordable, and scholar-friendly notarial services around the campus.
          </p>
        </header>

        {/* MAIN CONTENT (White Box Wrapper) */}
        <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8">
          <DirectoryView initialLocations={safeLocations} />
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-8 text-white/60 text-sm font-medium mt-4">
          <Link href="/submit" className="hover:text-white transition-colors">Submit a Location</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
        </div>

      </div>
    </main>
  );
}