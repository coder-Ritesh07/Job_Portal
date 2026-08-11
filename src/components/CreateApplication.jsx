import { getCreatedApplications } from "@/Apis/ApiApplication";
import { useSession, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import ApplicationCard from "./ApplicationCard";
import { BarLoader } from "react-spinners";
import JobCardSkeleton from "./Skeleton/JobCardSkeleton";

const CreateApplication = () => {
  const { session } = useSession();
  const { user, isLoaded } = useUser();
  const [application, setApplication] = useState();
  const [isLoading,setIsLoading]=useState(false)
  async function fetchAllUserApplication() {
    try {
      if (!session) return;
      setIsLoading(true)
      let token = await session.getToken();
      const { data, error } = await getCreatedApplications(token, {
        user_id: user.id,
      });
      setApplication(data);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("Error From Create Application", error);
    }finally{
        setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isLoaded) {
      fetchAllUserApplication();
    }
  }, [isLoaded, session]);
  if (!isLoaded) {
    return (
      <JobCardSkeleton/>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {" "}
      {application?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            Application={application}
            isCandidate
          />
        );
      })}
    </div>
  );
};

export default CreateApplication;
