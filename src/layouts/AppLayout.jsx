import React from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "@/components/Header"
import { ToastContainer } from "react-toastify";


const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen max-w-[90%] mx-auto ">
        <Header/>
        <Outlet />
      </main>
      <footer className="bg-[#4c4c4c48] text-center h-20 p-5 max-[325px]:text-[15px] max-[325px]:p-2">©️Copyright reserved❤️ Made By Ritesh</footer>

      {/* Toast Containe for Showing Messeges */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" newestOnTop closeOnClick pauseOnHover />
    </div>
  );
};

export default AppLayout;
