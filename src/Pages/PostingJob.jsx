import { addNewJobs } from "@/Apis/ApiJobs";
import { getCompanies } from "@/Apis/Companies";
import CompanyDrawer from "@/components/CompanyDrawer";
import PostJobSkeleton from "@/components/Skeleton/PostJobSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession, useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  requirement: z.string().min(1, { message: "Requirements are required" }),
});

const PostingJob = () => {
  const { session } = useSession();
  const { isLoaded, user } = useUser();
  const [companies, setCompanies] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState();
  const [createJobData,setCraeteJobData]=useState([])
  const navigate=useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirement: "",
    },
    resolver: zodResolver(schema),
  });

  async function getCompaniesDatas() {
    if (!session) return;
    const token = await session?.getToken();

    let { data, error } = await getCompanies(token);
    setCompanies(data);

    if(error)
    {
      console.log("Error from fetching Companies",error)
      toast.error("Unable to Fetch Companies")
    }
  }
  // console.log("company", companies);
  useEffect(() => {
    if (isLoaded && session) {
      getCompaniesDatas();
    }
  }, [session, isLoaded]);

  //* Form Submit Handler
  async function onSubmit(formData) {
    if (!session) return;

    try {
      setIsloading(true);

      const token = await session.getToken();

      const { data, error } = await addNewJobs(token, {
        ...formData,
        recruiter_id: user.id,
        isopen: true,
      });
      if (error) {
        throw error;
      }
      setCraeteJobData(data)
      toast.success("Job Posted Successfully")
     
      console.log("Job Posted Successfully:", data);

      reset();
      setSelectedState("");
      setSelectedCity("");
      setCities([]);
    } catch (error) {
      console.error("Error Posting Job:", error);
      toast.error("Unable to Post Jobs, Try Again")

      // If you have an error state
      setError(error.message || "Something went wrong");
    } finally {
      // Always runs
      setIsloading(false);
    }
  }

  useEffect(() => {
  if (createJobData?.length > 0) {
    navigate("/jobs");
  }
}, [createJobData, navigate]);

  if (!isLoaded) {
    return (
      <PostJobSkeleton/>
    );
  }
  if (user?.unsafeMetadata?.role !== "Recruiter") {
    return <Navigate to="/jobs" />;
  }
  return (
    <div>
      <h1 className="gradient-title mt-7 pb-8 text-center text-5xl sm:text-7xl font-bold">
        Post Jobs
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mb-10"
      >
        <Input
          placeholder="Enter Job Title.."
          className="h-10 "
          {...register("title")}
        />
        {errors.title && <p className="text-red-600 font-bold text-xl">{errors.title.message}</p>}
        <Textarea
          placeholder="Enter Job Desription"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-600 font-bold text-xl">{errors.description.message}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
          <Controller
            name="location"
            control={control}
            render={({ field }) => {
              return (
                <div className="flex w-full flex-col gap-4">
                  <Select
                    value={selectedState}
                    onValueChange={(statename) => {
                      setSelectedState(statename);
                      setSelectedCity("");
                      field.onChange("");

                      const state = State.getStatesOfCountry("IN").find(
                        (s) => s.name === statename,
                      );

                      if (state) {
                        setCities(City.getCitiesOfState("IN", state.isoCode));
                      } else {
                        setCities([]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full min-h-10 px-4">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {State.getStatesOfCountry("IN").map((state) => {
                          return (
                            <SelectItem key={state.isoCode} value={state.name}>
                              {state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedCity}
                    onValueChange={(cityname) => {
                      setSelectedCity(cityname);

                      field.onChange(`${cityname}, ${selectedState}`);
                    }}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className="w-full min-h-10 px-8">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger="false">
                      <SelectGroup>
                        {cities.map((city) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...field} />
                </div>
              );
            }}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => {
              return (
                <div className="w-full">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full min-h-10 px-4">
                      <SelectValue placeholder="Select Companies">
                        {field.value
                          ? companies?.find(
                              (com) => com.id === Number(field.value),
                            )?.name
                          : "Company"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {companies?.length &&
                          companies.map(({ name, id }) => {
                            return (
                              <SelectItem key={name} value={String(id)}>
                                {name}
                              </SelectItem>
                            );
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          />
        {
          <CompanyDrawer getCompanies={getCompaniesDatas}/>
        }
        </div>
        {errors.location && (
          <p className="text-red-600 text-xl font-bold">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-600 text-xl font-bold">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirement"
          control={control}
          render={({ field }) => {
            return (
              <div className="job-markdown">
                <MarkdownEditor
                  height="300px"
                  preview="preview"
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            );
          }}
        />
        {errors.requirement && (
          <p className="text-red-600 text-xl font-bold">{errors.requirement.message}</p>
        )}
        {error && <p className="text-red-600 font-bold text-xl">{error}</p>}
        {isloading && <BarLoader size={150} width="100%" color="#69D2E7 " />}
        <Button
          variant="blue"
          type="submit"
          className="text-xl font-bold"
          size="lg"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostingJob;
