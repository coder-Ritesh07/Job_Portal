import { getJobs } from "@/Apis/ApiJobs";
import { getCompanies } from "@/Apis/Companies";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/Skeleton/JobCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession, useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobLists = () => {
  const { session } = useSession();
  const { isLoaded } = useUser();
  // const userId = session?.user?.id;
  // console.log("User ID:", userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_Id] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [companies, setCompanies] = useState([]);

  function handleSearch(e) {
    e.preventDefault();
    let formdata = new FormData(e.target);
    let query = formdata.get("search-query");

    if (query) {
      setSearchQuery(query);
    }
    e.target.reset()
  }

  async function getCompaniesDatas() {
    try {
      if (!session) return;

      const token = await session?.getToken();

      let { data, error } = await getCompanies(token);
      setCompanies(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("Error From getting Companys", error);
    }
  }
  console.log("company", companies);

  async function fetchJobs() {
    try {
      setLoadingJobs(true);
      if (!session) return;

      const token = await session?.getToken();

      // console.log(token);

      const { data, error } = await getJobs(token, {
        location,
        company_id,
        searchQuery,
      });
      setJobs(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error from fetching Jobs", error);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    if (isLoaded && session) {
      getCompaniesDatas();
    }
  }, [session, isLoaded]);

  // console.log(jobs);
  useEffect(() => {
    if (!isLoaded || !session) return;

    fetchJobs();
  }, [isLoaded, session, location, company_id, searchQuery]);

  function handleClearFilter() {
    setLocation("");
    setSearchQuery("");
    setCompany_Id("");
  }

  if (!isLoaded) {
    return (
      <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
    );
  }

  return (
    <div>
      <h1 className="font-extrabold gradient-title text-5xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Filter Options */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center gap-4 mb-10"
      >
        <Input
          type="text"
          placeholder="Seacrh Job by titles..."
          className="sm:h-13 h-10 flex-1 px-4 text-md"
          name="search-query"
        />
        <Button type="submit" variant="blue" className="sm:h-13 h-10 sm:w-28">
          Search
        </Button>
      </form>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full min-h-10 px-4">
            <SelectValue placeholder="Filter By Loaction" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_Id(value)}
        >
          <SelectTrigger className="w-full min-h-10 px-4">
            <SelectValue placeholder="Filter By Companies">
              {company_id
                ? companies.find((c) => String(c.id) === company_id)?.name
                : "Filter By Companies"}
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
        <Button
          variant="red"
          className=" sm:w-1/3 h-10"
          onClick={handleClearFilter}
        >
          Clear Filter
        </Button>
      </div>

      {loadingJobs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs === null ? null : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <p className="text-4xl text-center text-red-500 sm:6xl font-extrabold">
              No Jobs Available Now
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobLists;
