import express from "express";
import { addAdmin, removeAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const adminRoutes = express.Router();

/* Add Admin */
adminRoutes.post("/addAdmin", verifyToken, addAdmin);

/* Remove Admin */

adminRoutes.post("/removeAdmin", verifyToken, removeAdmin);

export default adminRoutes;
