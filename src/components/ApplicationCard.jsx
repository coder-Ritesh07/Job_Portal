import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Boxes, BriefcaseIcon, Download, SchoolIcon } from "lucide-react";
import { useSession } from "@clerk/clerk-react";
import { updateApplication } from "@/Apis/ApiApplication";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "react-toastify";

const ApplicationCard = ({ Application, isCandidate = false }) => {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  // console.log(Application);
  function handleDownloadResume() {
    let link = document.createElement("a");
    link.href = Application?.resume;
    link.target = "_blank";
    link.click();
  }


  async function handleStatusChange(status) {
    try {
      if (!session) return;
      setLoading(true);
      let token = await session.getToken();
      let { data, error } = await updateApplication(
        token,
        {
          job_id: Application?.job_id,
        },
        status,
      );
      if (error) {
        throw error;
      }
      toast.success("Hiring Status Updated Sucessfully")
    } catch (error) {
      console.log("Error from UpdateApplication Status", error);
      toast.error("Unable to Change the Hiring Status");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="mb-10">
      <Card>
        {loading && (
          <BarLoader
            size={150}
            width="100%"
            color="#69D2E7 "
            className="mb-4"
          />
        )}
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row justify-between items-center gap-2 font-bold ">
            {isCandidate
              ? <h1 className="text-xl">{`${Application?.job?.title} at ${Application?.job?.company?.name}`}</h1>
              : <h1 className="text-2xl">Name: <span className="text-xl ">{Application?.name}</span></h1>}
              {
                isCandidate===false?<div className="flex gap-3 items-center text-xl"> <Download
              onClick={handleDownloadResume}
              size={18}
              className="bg-white text-black h-8 w-8 rounded-full p-1 cursor-pointer "
            />Resume</div>:<div><button onClick={handleDownloadResume} className="bg-white text-black rounded p-1 w-full cursor-pointer">View Resume</button></div>
              }
           
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col lg:flex-row sm:flex-col justify-between">
            <div className="flex gap-2 items-center">
              <BriefcaseIcon size={20} className="h-8" />
              {Application?.experience} year of Experience
            </div>
            <div className="flex gap-2 items-center">
              <SchoolIcon size={20} className="h-8" />
              {Application?.education}
            </div>
            <div className=" sm:flex-row gap-2 items-center flex flex-wrap ">
              <Boxes size={20} className="h-8" />
              Skills: {Application?.skills?.split(",").map((skill,idx)=>(

                  <p key={idx} className="bg-white rounded p-1 font-semibold text-black">{skill.trim()}</p>
               
              ))}
            </div>
          </div>
          <hr />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span>{new Date(Application?.created_at).toLocaleString()}</span>
          {isCandidate ? (
            <span className="capitalize font-bold">
              Status: {Application?.status}
            </span>
          ) : (
            <Select
              onValueChange={handleStatusChange}
              defaultValue={Application?.status.toUpperCase()}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationCard;
