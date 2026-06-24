"use client";

import dynamic from "next/dynamic";
import type { CoreLocation } from "@/lib/types/location";

const PublicMap = dynamic(
  () => import("@/components/map/public-map").then((mod) => mod.PublicMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[70vh] w-full items-center justify-center rounded-2xl border bg-slate-100 text-slate-500">
        Loading map...
      </div>
    ),
  }
);

type PublicMapShellProps = {
  locations: CoreLocation[];
};

export function PublicMapShell({ locations }: PublicMapShellProps) {
  return <PublicMap locations={locations} />;
}
