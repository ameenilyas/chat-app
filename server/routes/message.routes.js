import express from "express";
import { sendMessage, allMessages } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

export default router;
