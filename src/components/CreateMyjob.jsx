import { getMyJobs } from "@/Apis/ApiJobs";
import { useSession, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { toast } from "react-toastify";

const CreateMyjob = () => {
  const { user } = useUser();
  const { session } = useSession();
  const [myJob, setIsMyJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  async function fetchMyAllJobs() {
    try {
      if (!session) return;
      setIsLoading(true);
      let token = await session.getToken();
      const { data, error } = await getMyJobs(token, {
        recruiter_id: user.id,
      });
      if (error) {
        throw error;
      }
      setIsMyJob(data);
      toast.success("Job Cards Loaded successfully! 🎉");
    } catch (error) {
      console.log("Error From My Job ", error);
       toast.error("Failed to load your jobs. Please try again!");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMyAllJobs();
  }, [session, user]);
  return (
    <div>
      {isLoading ? (
        <BarLoader size={150} width="100%" color="#69D2E7" className="mb-4" />
      ) : myJob?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          {myJob.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobSaved={fetchMyAllJobs}
              isMyjobs
            />
          ))}
        </div>
      ) : (
        <p className="text-3xl text-red-500 sm:6xl font-extrabold">
          No Jobs Available Now 🥹
        </p>
      )}
    </div>
  );
};

export default CreateMyjob;
