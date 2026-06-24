import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEditLocation() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Form and Map Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  );
}