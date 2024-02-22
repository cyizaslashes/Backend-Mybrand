import express from "express";
import * as MessageController from "../controllers/message";

const router = express.Router();
router.get("/", MessageController.getMessages);
router.post("/", MessageController.createMessages);
router.get("/:messageId", MessageController.getMessage);
router.delete("/:messageId", MessageController.deleteMessage);

export default router;