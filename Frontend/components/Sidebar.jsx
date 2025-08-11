import React, { useEffect, useState } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/Authprovider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`promptHistory_${user._id}`);
    if (stored) {
      const allMessages = JSON.parse(stored);

      const userMessages = allMessages.filter((msg) => msg.role === "user");
      setHistory(userMessages);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/user/logout",
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Logout failed");
    }
  };

  const handleHistoryClick = (index) => {
    navigate(`/chat/${index}`);
  };

  return (
    <div className="h-full flex flex-col bg-[#232327]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="text-xl font-bold text-white">Desi-Ai</div>
        <button onClick={onClose}>
          <X className="text-gray-300 h-6 w-6" />
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-hide">
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
          onClick={() => {
            localStorage.setItem(
              `promptHistory_${user._id}`,
              JSON.stringify([])
            );
            setHistory([]);
            navigate("/chat");
          }}
        >
          + New Chat
        </button>

        {history.length > 0 ? (
          history.map((msg, index) => (
            <div
              key={index}
              onClick={() => handleHistoryClick(index)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm cursor-pointer truncate"
              title={msg.content}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm text-center">
            No chat history yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img className="rounded-full w-10 h-10" src="" alt="Profile" />
            <span className="text-gray-300">
              {user ? user.firstname : "My Profile"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
