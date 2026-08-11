import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <>
      <Card className="w-full mb-5">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-4 w-2/3" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-4 " />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <hr />
        <CardFooter>
          <Skeleton className="h-12 w-full rounded-md" />
        </CardFooter>
      </Card>
    </>
  );
};

export default JobCardSkeleton;
