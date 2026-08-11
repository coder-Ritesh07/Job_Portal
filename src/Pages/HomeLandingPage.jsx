import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import companies from "@/Data/Companies.json";
import faqs from "@/Data/Faqs.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  return (
    <>
      <main className="flex flex-col sm:gap-20 gap-15">
        <section className="mt-9 flex flex-col gap-y-7 justify-center ">
          <h1 className="flex flex-col justify-center items-center font-extrabold text-3xl lg:text-8xl sm:text-6xl py-4 gradient-title tracking-tighter ">
            Find Your Dream Job{" "}
            <span className="flex justify-center items-center gap-2">
              and get{" "}
              <img
                src="/Joblogo.png"
                alt="Joblogo"
                className="h-14 sm:h-28 lg:h-36"
              />
            </span>
          </h1>
          <p className="text-[15px] text-center sm:text-xl flex justify-center gradient-title ">
            Exploring Thousands of Job listing or finding the perfect candidate
          </p>
          <div className="flex sm:gap-x-10 sm:flex-row gap-y-5 items-center flex-col justify-center mt-10">
            {/* Buttons */}
            <Link to="/jobs">
              <Button variant="blue" size="xl">
                Find Jobs
              </Button>
            </Link>
            <Link to="/post-jobs">
              <Button variant="red" size="xl">
                Post Jobs
              </Button>
            </Link>
          </div>
        </section>

        {/* carousel section */}
        <section className="mt-10">
          <Carousel className="w-full " plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent className="flex items-center gap-10 lg:gap-20">
              {companies.map(({ name, id, path }) => {
                return (
                  <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                    <img
                      src={path}
                      alt={name}
                      className="h-9 sm:h-14 object-contain"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </section>
        {/* Banner Image */}
        <section>
          <img src="./Jobbanner.jpeg" alt="jobbanner" className="w-full" />
        </section>
        {/* Card section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <Card>
            <CardHeader>
              <CardTitle>For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Seacrh and Apply for jobs, track application and more.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Post job, manage application, and find the best candidate.</p>
            </CardContent>
          </Card>
        </section>
        {/* Accordiaon */}
        <section className="mb-20">
          <Accordion defaultValue={["item-1"]}  >
            {faqs.map((faq, idx) => {
              return (
                <AccordionItem key={idx} value={`item-${idx+1}`}>
                  <AccordionTrigger >{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </main>
    </>
  );
};

export default Home;
