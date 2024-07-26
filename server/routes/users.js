import express from "express";
import { getUser, getAllUsers } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/* READ */
userRoutes.get("/:id", verifyToken, getUser);

/* GET All Users */
userRoutes.get("/", getAllUsers);

export default userRoutes;
