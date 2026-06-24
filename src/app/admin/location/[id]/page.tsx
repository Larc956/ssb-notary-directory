import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CoreLocation } from "@/lib/types/location";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminOverviewShell } from "@/components/map/admin-overview-shell";
import { CheckCircle2, AlertCircle, MapPinOff } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: false }); // Sort by newest first!

  if (error) console.error("Error fetching admin locations:", error);
  const safeLocations = (locations as CoreLocation[]) || [];

  // Calculate Summary Stats
  const pendingCount = safeLocations.filter(loc => loc.verification_status === "under_review").length;
  const approvedCount = safeLocations.filter(loc => loc.verification_status === "approved").length;
  const missingCoordsCount = safeLocations.filter(loc => !loc.active_latitude || !loc.active_longitude).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h2>
        <p className="text-slate-500">Moderate submissions and manage directory integrity.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Live Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card className={pendingCount > 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${pendingCount > 0 ? "text-rose-800" : "text-slate-600"}`}>
              Pending Review Queue
            </CardTitle>
            <AlertCircle className={`h-4 w-4 ${pendingCount > 0 ? "text-rose-600" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingCount > 0 ? "text-rose-900" : "text-slate-900"}`}>
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card className={missingCoordsCount > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${missingCoordsCount > 0 ? "text-amber-800" : "text-slate-600"}`}>
              Missing Coordinates
            </CardTitle>
            <MapPinOff className={`h-4 w-4 ${missingCoordsCount > 0 ? "text-amber-600" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${missingCoordsCount > 0 ? "text-amber-900" : "text-slate-900"}`}>
              {missingCoordsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Map */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Geospatial Distribution</h3>
        <AdminOverviewShell locations={safeLocations} />
      </div>

      {/* Data Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Recent Database Entries</h3>
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
                <TableRow key={loc.id} className={loc.verification_status === "under_review" ? "bg-rose-50/30" : ""}>
                  <TableCell className="font-medium">
                    {loc.name}
                    {loc.branch_name && <span className="block text-xs text-slate-500 font-normal">{loc.branch_name}</span>}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={loc.raw_address}>
                    {loc.raw_address}
                  </TableCell>
                  <TableCell>
                    {loc.active_latitude && loc.active_longitude ? (
                      <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">Set</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">Missing</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={loc.verification_status === "approved" ? "default" : loc.verification_status === "under_review" ? "destructive" : "secondary"}>
                      {loc.verification_status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant={loc.verification_status === "under_review" ? "default" : "ghost"} size="sm" asChild>
                      <Link href={`/admin/location/${loc.id}`}>
                        {loc.verification_status === "under_review" ? "Review" : "Edit"}
                      </Link>
                    </Button>
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
    </div>
  );
}