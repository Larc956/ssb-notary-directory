import { SubmitLocationForm } from "@/components/locations/submit-location-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add a Notary</h1>
            <p className="text-slate-500">Help the community by adding a new notary public location.</p>
          </div>
        </div>

        <SubmitLocationForm />
      </div>
    </main>
  );
}