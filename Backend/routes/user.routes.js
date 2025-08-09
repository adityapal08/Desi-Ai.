import express from "express";
import { Login, Logout, Signup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);

export default router;
