import express from "express";
import { getUser, getAllUsers, deleteUser } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/* READ */
userRoutes.get("/:id", verifyToken, getUser);

/* GET All Users */
userRoutes.get("/", verifyToken, getAllUsers);

/* DELETE USER */

userRoutes.delete("/:id", verifyToken, deleteUser);

export default userRoutes;
