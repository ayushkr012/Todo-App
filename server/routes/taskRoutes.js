import express from "express";
import {
  createTask,
  getAllUserTask,
  getParticularUsertask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/auth.js";

const taskRoutes = express.Router();

/*  Create Task */
taskRoutes.post("/createTask", verifyToken, createTask);

/* Retrieve all tasks for all users */
taskRoutes.get("/", verifyToken, getAllUserTask);

/* Retrieve all tasks for particular User */
taskRoutes.get("/:userId", verifyToken, getParticularUsertask);

/* Update Task */
taskRoutes.put("/:id/:userId", verifyToken, updateTask);

/* Delete Task */
taskRoutes.delete("/:id/:userId", verifyToken, deleteTask);

export default taskRoutes;
