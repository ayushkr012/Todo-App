import express from "express";
import {
  createTask,
  getAllUserTask,
  getParticularUsertask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const taskRoutes = express.Router();

/*  Create Task */
taskRoutes.post("/createTask", createTask);

/* Retrieve all tasks for all users */
taskRoutes.get("/", getAllUserTask);

/* Retrieve all tasks for particular User */
taskRoutes.get("/:userId", getParticularUsertask);

/* Update Task */
taskRoutes.put("/:id/:userId", updateTask);

/* Delete Task */
taskRoutes.delete("/:id/:userId", deleteTask);

export default taskRoutes;
