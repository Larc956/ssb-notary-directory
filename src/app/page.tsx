import { mockLocations } from "../data/mock-locations";
import { PublicMapShell } from "../components/map/public-map-shell";
import { LocationList } from "../components/locations/location-list";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            SSB Notary Directory
          </h1>
          <p className="max-w-2xl text-slate-600">
            Find nearby notary public offices with student-friendly information.
          </p>
        </section>

        <PublicMapShell locations={mockLocations} />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Nearby locations</h2>
          <LocationList locations={mockLocations} />
        </section>
      </div>
    </main>
  );
}
