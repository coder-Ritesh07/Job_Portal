import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

const Onboarding = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  console.log(user);

  // handling the user role by cliking the buttons accordingly
  async function handleUserRole(role) {
    try {
      await user.update({
        unsafeMetadata: { role },
      });

      navigate(role === "Recruiter" ? "/" : "/jobs");
    } catch (err) {
      console.log("Error from Updating Role-", err);
      toast.error("Unable to Update User Role! ");
    }
  }

  // Checking the user role whenever user chnages
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user?.unsafeMetadata?.role === "Recruiter" ? "/" : "/jobs", {
        replace: true,
      });
    }
  }, [user]);

  // if isloaded is false then show the BarLoader
  if (!isLoaded) {
    return (
      <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="gradient-title text-6xl font-extrabold sm:text-8xl">
        I am a...
      </h1>
      <div className="my-10 flex flex-col md:flex-row gap-10  ">
        <Button
          size="xl"
          className="md:h-36 md:px-20 md:text-3xl h-28 text-2xl"
          variant="blue"
          onClick={() => handleUserRole("Candidate")}
        >
          Candidate
        </Button>
        <Button
          size="xl"
          className="md:h-36 md:px-20 md:text-3xl h-28 text-2xl"
          variant="red"
          onClick={() => handleUserRole("Recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
