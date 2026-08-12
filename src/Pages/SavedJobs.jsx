import { getSavedJobs } from "@/Apis/ApiJobs";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/Skeleton/JobCardSkeleton";
import { useSession, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { session } = useSession();
  const { user, isLoaded } = useUser();
  const [isError, setIsError] = useState(null);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);
  const [savedJobs, setSavedJobs] = useState(null);
  async function fetchUserSavedJobs() {
    try {
      if (!session) return;
      setLoadingSavedJobs(true);
      let token = await session.getToken();

      let { data, error } = await getSavedJobs(token);
      console.log(data);
      setSavedJobs(data);
      if (error) {
        throw error;
      }
    } catch (error) {
      setIsError(error.message);
      console.log("Error From getSavedJobs", error);
    } finally {
      setLoadingSavedJobs(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchUserSavedJobs();
    }
  }, [isLoaded, session]);

  if (!isLoaded ) {
    return (
      <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
    );
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl md:text-7xl text-center">
        Saved Jobs
      </h1>
      <div className="mt-10">
        {loadingSavedJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            {savedJobs?.length ? (
              savedJobs.map((savedJob) => {
                return (
                  <JobCard
                    key={savedJob.id}
                    job={savedJob.job}
                    savedInit={true}
                    onJobSaved={fetchUserSavedJobs}
                  />
                );
              })
            ) : (
              <p className="text-3xl text-red-500 sm:6xl font-extrabold">
                No Jobs Available Now 😥
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
