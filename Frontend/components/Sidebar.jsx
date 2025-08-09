import React, { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/Authprovider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert(data.message);

      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout failed");
    }
  };
  return (
    <div className="h-full flex flex-col bg-[#232327]">
      {/*Header*/}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="text-xl font-bold text-white">Desi-Ai</div>
        <button>
          <X className="text-gray-300 h-6 w-6" />
        </button>
      </div>
      {/*History*/}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4">
          + New Chat
        </button>
        <div className="text-gray-500 text-sm  text-center">
          No chat history yet
        </div>
      </div>
      {/*Footer*/}
      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img className="rounded-full w-10 h-10" src="" alt="" />
            <span className="text-gray-300">
              {user ? user.firstname : "My Profile"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut className="" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default sidebar;
