import { useSession, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { HeartIcon, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteMyJob, savedJobs } from "@/Apis/ApiJobs";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

const JobCard = ({
  job,
  isMyjobs = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [isSaved, setIsSaved] = useState(savedInit);
  const [loadingDelete,setLoadingDelete]=useState(false)

  async function handleSaveToggle() {
    if (!session) return;

    let token = await session?.getToken();

    let { data, error } = await savedJobs(
      token,
      {
        alreadySaved: isSaved,
      },
      {
        user_id: user.id,
        job_id: job.id,
      },
    );

    if (!error) {
      setIsSaved((prev) => !prev);
      onJobSaved(job.id, !isSaved);
    } else {
      console.error(error);
    }
  }

  async function handleDeleteJob() {
    try {
      if (!session) return;
      setLoadingDelete(true)
    let token = await session?.getToken();
    let {data,error}=await deleteMyJob(token,{job_id:job.id})
    if(error)
      {
        throw error
      }
      onJobSaved()
      toast.success("Job Deleted Successfully")
    } catch (error) {
      console.log("Error from Delete MyJob",error)
      toast.error("Unable to Delete Job,Try Again")
    }finally{
      setLoadingDelete(false)
    }
  }

  return (
    <div>
      <Card className="mb-5">
      {
        loadingDelete&&<BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
      }
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {job.title}
            {isMyjobs && (
              <Trash2Icon
                fill="red"
                size={18}
                className="text-red-600 cursor-pointer"
                onClick={handleDeleteJob}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {job.company && <img src={job.company.logo_url} className="h-8" />}
            <div className="flex gap-3 items-center">
              <MapPinIcon size={18} className="text-white" />
              {job.location}
            </div>
          </div>
          <hr />
          <div>{job.description}</div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Link to={`/jobs/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full cursor-pointer">
              More Details
            </Button>
          </Link>
          {!isMyjobs && (
            <Button
              variant="outline"
              className="w-15"
              onClick={handleSaveToggle}
              disabled={!isLoaded}
            >
              {isSaved ? (
                <HeartIcon className=" text-red-600" fill="red" size={18} />
              ) : (
                <HeartIcon className="text-gray-500 " fill="none" size={18} />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
