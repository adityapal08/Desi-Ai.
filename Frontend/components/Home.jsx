import React from "react";
import Sidebar from "./sidebar.jsx";
import Prompt from "./prompt.jsx";

const Home = () => {
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      {/*Sidebar*/}
      <div className="w-64 bg-[#232327]">
        <Sidebar />
      </div>
      {/*prompt*/}
      <div className="flex-1 flex flex-col w-full">
        <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto scrollbar-hide">
          <Prompt />
        </div>
      </div>
    </div>
  );
};

export default Home;
