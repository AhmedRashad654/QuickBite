import { Skeleton } from "@/components/ui/skeleton";

interface LoaderProps {
  viewType?: "table" | "cards" | "form";
  count?: number;
}

export const Loader = ({ viewType = "cards", count = 3 }: LoaderProps) => {
  if (viewType === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="border rounded-xl p-5 space-y-4 bg-card">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewType === "table") {
    return (
      <div className="border rounded-xl p-4 bg-card space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-2 border-b">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 border-b last:border-0"
          >
            <div className="flex items-center space-x-3 w-1/4">
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 bg-card max-w-lg space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
};
