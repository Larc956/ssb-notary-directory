"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoreLocation } from "@/lib/types/location";

const DynamicAdminOverviewMap = dynamic(
  () => import("./admin-overview-map").then((mod) => mod.AdminOverviewMap),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-xl border border-slate-300" />
  }
);

export function AdminOverviewShell({ locations }: { locations: CoreLocation[] }) {
  return <DynamicAdminOverviewMap locations={locations} />;
}