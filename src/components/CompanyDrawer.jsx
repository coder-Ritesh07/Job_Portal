import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "@clerk/clerk-react";
import { addANewCompany } from "@/Apis/Companies";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Company name must required" }),
  logo_url: z
    .any()
    .refine(
      (files) =>
        files &&
        files.length > 0 &&
        (files[0].type === "image/png" || files[0].type === "image/jpeg"),
      { message: "Only png and jpeg are allowed" },
    ),
});

const CompanyDrawer = ({ getCompanies }) => {
    const {session}=useSession()
    const [isLoading,setIsLoading]=useState(false)
    const [isError,setIsError]=useState(null)
    const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

//*   OnSubmited the Add company form from Drawer
  async function onSubmit(formData) {
    try {
      if(!session)return
      setIsLoading(true)
      const token=await session.getToken()
      console.log("Tokens",token)
      let {data,error}=await addANewCompany(token,{
          ...formData,
          logo_url:formData.logo_url[0]
      })
      if(data?.length>0)
      {
        await getCompanies()
        reset()
        setOpen(false)
      }
      if(error)
      {
         throw error
      }
    } catch (error) {
      console.log("Error From Add Company FetchData",error);
      setIsError(error.message)
    }finally{
       setIsLoading(false)
    }
  }
  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="blue" className="h-10 font-bold" type="button" />}>
          Add Company
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Company</DrawerTitle>
          </DrawerHeader>
          <form className="p-4 flex flex-col gap-4">
            <Input placeholder="Enter Company Name" {...register("name")} />
             {errors.name && (
            <p className="text-red-600 font-bold text-xl px-4">
              {errors.name.message}
            </p>
          )}
            <Input
              type="file"
              accept="image/*"
              className="file:text-gray-500 hover:cursor-pointer"
              {...register("logo_url")}
            />
              {errors.logo_url && (
            <p className="text-red-600 font-bold text-xl px-4">
              {errors.logo_url.message}
            </p>
          )}
            <Button
              variant="blue"
              type="button"
              className="text-[17px]"
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </Button>
          </form>
          {
            isError&&<p className="text-red-600 font-bold text-xl px-4">{isError}</p>
          }
          {
            isLoading&& <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
          }
          <DrawerFooter>
            <DrawerClose render={<Button variant="secondary" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CompanyDrawer;
