import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CoreLocation } from "@/lib/types/location";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// NEW: Helper function to safely render text and catch corrupted database objects
const renderSafeText = (val: any) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string" || typeof val === "number") return String(val);
  return JSON.stringify(val); // Renders the raw object safely so the page doesn't crash
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch ALL rows, sorting by newest first
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .order("name", { ascending: true });

  if (error) console.error("Error fetching admin locations:", error);
  const safeLocations = (locations as CoreLocation[]) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Locations Database</h2>
          <p className="text-slate-500">Manage, verify, and geocode directory entries.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Office Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeLocations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="font-medium">
                  {renderSafeText(loc.name)}
                  {loc.branch_name && (
                    <span className="block text-xs text-slate-500 font-normal">
                      {renderSafeText(loc.branch_name)}
                    </span>
                  )}
                </TableCell>
                
                {/* Wrapped the raw address in the safety function */}
                <TableCell className="max-w-[200px] truncate" title={renderSafeText(loc.raw_address)}>
                  {renderSafeText(loc.raw_address)}
                </TableCell>
                
                <TableCell>
                  {loc.active_latitude && loc.active_longitude ? (
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">Set</Badge>
                  ) : (
                    <Badge variant="outline" className="text-rose-700 bg-rose-50 border-rose-200">Missing</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={loc.verification_status === "approved" ? "default" : "secondary"}>
                    {renderSafeText(loc.verification_status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {loc.id ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/location/${loc.id}`}>Edit</Link>
                    </Button>
                  ) : (
                    <Badge variant="destructive">Missing ID</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {safeLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}