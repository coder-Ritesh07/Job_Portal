import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyToJobs } from "@/Apis/ApiApplication";
import { useSession } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (files) =>
        files &&
        files.length > 0 &&
        (files[0].type === "application/pdf" ||
          files[0].type === "application/msword" ||
          files[0].type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      { message: "Only PDF and Word Documents are allowed" },
    ),
});
const ApplyJobDrawer = ({ job, user, fetchJob, Applied = false }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      experience: 0,
      skills: "",
      education: "",
      resume: undefined,
    },
  });
  const { session } = useSession();

  const onSubmit = async (formData) => {
    if (!session) return;
    if (!user.fullName?.trim()) {
  alert("Please add your full name to your profile before applying.");
  return;
}
    let token = await session.getToken();
    const { data, error } = await applyToJobs(token, {
      ...formData,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: formData.resume[0],
    });
    if (error) {
      console.error("Error Coming From Apply to Job",error);
      toast.error("Unable to Upload Job, Right Now")
      return;
    }
    // Close the drawer
    setOpen(false);

    // Clear the form
    reset();
    toast.success("Job Applied Sucessfully")
    // Refresh the job
    fetchJob();
    console.log("Apply Job Data-", data);
  };
  //  console.log(user.fullName,user.username,user.primaryEmailAddress?.emailAddress)
  return (
    <div className="text-center mb-10">
      <Drawer open={Applied ? false : open} onOpenChange={setOpen}>
        <DrawerTrigger
          render={
            <Button
              variant={job?.isopen && !Applied ? "green" : "red"}
              disabled={!job?.isopen || Applied}
              size="xl"
            >
              {job?.isopen ? (Applied ? "Applied" : "Apply") : ("Hirirng Closed")}
            </Button>
          }
        ></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply For {job?.title} at {job?.company?.name}
            </DrawerTitle>
            <DrawerDescription>Please fill the form below.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 "
            >
              <Input
                type="number"
                placeholder="Year of Experience"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-red-600">{errors.experience.message}</p>
              )}
              <Input
                type="text"
                placeholder="Skills (Should be Comma Separated)"
                {...register("skills")}
              />
              {errors.skills && (
                <p className="text-red-600">{errors.skills.message}</p>
              )}
              <Controller
                name="education"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="Intermediate"
                          id="intermediate"
                        />
                        <Label htmlFor="intermediate">Intermediate</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Graduate" id="graduate" />
                        <Label htmlFor="graduate">Graduate</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="Post Graduate"
                          id="postgraduate"
                        />
                        <Label htmlFor="postgraduate">Post Graduate</Label>
                      </div>
                    </RadioGroup>
                  );
                }}
              />
              {errors.education && (
                <p className="text-red-600">{errors.education.message}</p>
              )}
              <Input
                type="file"
                accept=".pdf, .doc, .docx"
                className="file:text-gray-500 hover:cursor-pointer"
                {...register("resume")}
              />
              {errors.resume && (
                <p className="text-red-600">{errors.resume.message}</p>
              )}
              <Button
                type="submit"
                variant="blue"
                className="hover:cursor-pointer"
              >
                Apply
              </Button>
            </form>
          </div>
          <DrawerFooter>
            <DrawerClose
              render={<Button variant="outline">Cancel</Button>}
            ></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ApplyJobDrawer;
