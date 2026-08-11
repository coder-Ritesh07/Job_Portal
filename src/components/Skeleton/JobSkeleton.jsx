import { Skeleton } from "../ui/skeleton";

const JobSkeleton = () => {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {/* Title + Logo */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6">
        <Skeleton className="h-16 w-80 rounded-md" />
        <Skeleton className="h-16 w-16 rounded-md" />
      </div>

      {/* Job info */}
      <div className="flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Hiring Status */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* About */}
      <Skeleton className="h-8 w-52" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Requirements */}
      <Skeleton className="h-8 w-72" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Apply Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};

export default JobSkeleton;