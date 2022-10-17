import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

export default router;
