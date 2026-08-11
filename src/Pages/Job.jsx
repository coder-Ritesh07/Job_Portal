import { getSingleJob, updateHiringStatus } from "@/Apis/ApiJobs";
import { useSession, useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";
import ApplicationCard from "@/components/ApplicationCard";
import JobSkeleton from "@/components/Skeleton/JobSkeleton";
import { toast } from "react-toastify";
const Job = () => {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const { id } = useParams();
  const [singleJob, setSingleJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchSingleJobs() {
    try {
      if (!session) return;
      setIsLoading(true);
      let token = await session.getToken();

      let { data, error } = await getSingleJob(token, { job_id: id });
      
      if (error) {
        throw error;
      }
      setSingleJob(data);
    } catch (error) {
      console.log("Error From Get a Single JOb", error);
      toast.error("Unable to Fetch Job, Try Again !")
    } finally {
      setIsLoading(false);
    }
  }

  console.log("Single Job", singleJob);

  async function handleChnageStatus(value) {
    if (!session) return;

    let token = await session.getToken();
    let isopen = value === "open";
    let { data: updateStatusData, error } = await updateHiringStatus(
      token,
      { job_id: id },
      isopen,
    );
    // console.log("updateStatusData",updateStatusData)

    setSingleJob((prev) => ({
      ...prev,
      isopen,
    }));
    toast.success("Job Status Changed Successfully")

    if (error) {
       console.log("Error From Get a Single JOb Status", error);
       toast.error("Unable to Changed the JOb Status")
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchSingleJobs();
    }
  }, [session, isLoaded]);

  if (!isLoaded || isLoading || !singleJob) {
    return (
      <JobSkeleton/>
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-6">
      {!isLoaded && (
        <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
      )}
      <div className="flex flex-col-reverse gap-6 sm:flex-row justify-between items-center">
        <h1 className="gradient-title text-5xl sm:text-6xl max-[325px]:text-4xl pb-5 font-extrabold">
          {singleJob?.title}
        </h1>
        <img
          src={singleJob?.company?.logo_url}
          className="h-16 max-[325px]:h-13"
          alt={singleJob?.title}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row justify-between">
        <div className="flex gap-3 items-center">
          <MapPinIcon />
          {singleJob?.location}
        </div>
        <div className="flex gap-3 items-center">
          <Briefcase />
          <p>{singleJob?.application?.length} Applications</p>
        </div>
        <div className="flex gap-3 items-center">
          {singleJob?.isopen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <>
              <DoorClosed />
              Close
            </>
          )}
        </div>
      </div>
      {/* About Job Status */}
      {singleJob?.recruiter_id === user.id && (
        <Select onValueChange={handleChnageStatus}>
          <SelectTrigger
            className={`w-full ${
              singleJob?.isopen
                ? "bg-green-700! text-white"
                : "bg-red-700! text-white"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status (${singleJob?.isopen ? "Open" : "Close"})`}
            />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="close">Close</SelectItem>
          </SelectContent>
        </Select>
      )}
      <h2 className="text-3xl sm:text-5xl font-bold">About the Job</h2>
      <p className="text-lg">{singleJob?.description}</p>
      <h1 className="text-3xl sm:text-5xl font-bold">We are looking for?</h1>
      <div className="job-markdown">
        <MarkdownEditor.Markdown source={singleJob?.requirement} />
      </div>

      {singleJob?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={singleJob}
          user={user}
          fetchJob={fetchSingleJobs}
          Applied={singleJob?.application?.find(
            (ap) => ap.candidate_id === user?.id,
          )}
        />
      )}

      {/* Application tracking */}
      {singleJob?.application?.length > 0 &&
        singleJob?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-4xl font-bold">Applications</h2>
            {singleJob?.application?.map((application) => {
              return (
                <ApplicationCard
                  key={application.id}
                  Application={application}
                />
              );
            })}
          </div>
        )}
    </div>
  );
};

export default Job;
