import React from "react";
import Home from "../components/Home.jsx";
import Signup from "../components/Signup.jsx";
import Login from "../components/Login.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/Authprovider.jsx";

const App = () => {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to={"/"} /> : <Signup />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
