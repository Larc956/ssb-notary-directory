import type { CoreLocation } from "@/lib/types/location";

type LocationListProps = {
  locations: CoreLocation[];
};

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="grid gap-3">
      {locations.map((location) => (
        <article
          key={location.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">
              {location.display_name}
            </h2>
            <p className="text-sm text-slate-600">{location.raw_address}</p>
            {location.office_hours_text ? (
              <p className="text-sm text-slate-500">{location.office_hours_text}</p>
            ) : null}
            {location.standard_fee_text ? (
              <p className="text-sm font-medium text-blue-700">
                {location.standard_fee_text}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
