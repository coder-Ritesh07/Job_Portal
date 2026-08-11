import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostJobSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex justify-center">
        <Skeleton className="h-16 w-96 rounded-lg" />
      </div>

      {/* Job Title */}
      <Skeleton className="h-11 w-full rounded-md" />

      {/* Description */}
      <Skeleton className="h-36 w-full rounded-md" />

      {/* Location + Company */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* State & City */}
        <div className="flex flex-col gap-4 flex-1">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        {/* Company */}
        <Skeleton className="h-11 flex-1 rounded-md" />

        {/* Add Company Button */}
        <Skeleton className="h-11 w-40 rounded-md" />
      </div>

      {/* Markdown Editor */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-75 w-full rounded-lg" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};

export default PostJobSkeleton;