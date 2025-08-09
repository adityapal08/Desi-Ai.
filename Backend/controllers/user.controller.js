import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config.js";

import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log(firstname, lastname, email, password);

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({ errors: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    return res.status(201).json({ message: "Signup successfully", newUser });
  } catch (error) {
    console.log("Error in signup", error);
    return res.status(500).json({ errors: "Error in signup" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    //token
    const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, {
      expiresIn: "10d",
    });
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.cookie("jwt", token, cookieOptions);
    return res
      .status(201)
      .json({ message: "User logged in succeded", user, token });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({ errors: "Error in login" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(201).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout", error);
    return res.status(500).json({ errors: "Error in logout" });
  }
};
