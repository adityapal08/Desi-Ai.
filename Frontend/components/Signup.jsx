import { Eye } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e.target.value);
    const value = e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/signup",
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      alert(data.message || "Signup successfull");
      navigate("/login");
    } catch (error) {
      const msg = error?.response?.data?.errors || "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        {/*Heading*/}
        <h1 className="text-white items-center justify-center text-center font-bold text-2xl">
          Signup
        </h1>

        {/*First name*/}
        <div className="mb-4 mt-2">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="text"
            name="firstname"
            placeholder="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>
        {/*Lastname*/}
        <div className="mb-4 mt-2">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="text"
            name="lastname"
            placeholder="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        {/*Email*/}
        <div className="mb-4 mt-2">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/*Password*/}
        <div className="mb-4 mt-2 relative">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <Eye size={18} />
          </span>
        </div>

        {/*error*/}
        {error && <span className="text-red-600 text-sm mb-4">{error}</span>}

        {/*Terms & conditions*/}
        <p className="text-xs text-gray-400 mt-4 mb-6">
          By signing up or loading in, you consent to DeepSeek's{" "}
          <a className="underline" href="">
            Term's of Use
          </a>
          and{" "}
          <a className="underline" href="">
            Privacy Policy
          </a>
        </p>

        {/*Signup*/}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#7a6ff0] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing..." : "Signup"}
        </button>

        {/*Links*/}
        <div className="flex justify-between mt-4 text-sm">
          <a className="text-[#7a6ff0] hover:underline" href="">
            User already registered?
          </a>
          <Link className="text-[#7a6ff0] hover:underline" to={"/login"}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
