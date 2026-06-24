import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import type { CoreLocation } from "@/lib/types/location";
import { calculateDistance } from "@/lib/utils";

type LocationListProps = {
  locations: CoreLocation[];
  userLocation: [number, number] | null;
  // 1. Add the selection handler prop
  onSelectLocation: (location: CoreLocation) => void; 
};

export function LocationList({ locations, userLocation, onSelectLocation }: LocationListProps) {
  if (locations.length === 0) {
    return <p className="text-slate-500 py-4">No locations found matching your criteria.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => {
        let distanceText = null;
        if (userLocation && location.active_latitude && location.active_longitude) {
          const dist = calculateDistance(
            userLocation[0], userLocation[1],
            location.active_latitude, location.active_longitude
          );
          distanceText = dist < 1 ? `${(dist * 1000).toFixed(0)} m away` : `${dist.toFixed(1)} km away`;
        }

        return (
          <Card 
            key={location.id} 
            // 2. Add cursor-pointer and onClick to trigger the sheet
            className="overflow-hidden hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
            onClick={() => onSelectLocation(location)}
          >
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg text-blue-950 leading-tight">
                  {location.name}
                </CardTitle>
                {distanceText && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                    <Navigation className="w-3 h-3 mr-1 inline" />
                    {distanceText}
                  </Badge>
                )}
              </div>
              {location.branch_name && (
                <p className="text-xs font-medium text-slate-500">{location.branch_name}</p>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="leading-snug line-clamp-2">{location.raw_address}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {location.standard_fee_text && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                    {location.standard_fee_text}
                  </Badge>
                )}
                {location.student_discount_available && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
                    Student Discount
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}