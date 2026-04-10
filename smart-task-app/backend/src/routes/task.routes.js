import express from "express";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// PROTECTED ROUTES
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);

export default router;