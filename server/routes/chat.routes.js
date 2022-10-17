import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  accessChats,
  fetchAllChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.route("/").post(protect, accessChats);
router.get("/", protect, fetchAllChats);
router.route("/group").post(protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/").delete(protect, deleteChat);

export default router;
