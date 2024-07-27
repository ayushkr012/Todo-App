import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/taskRoutes.js";
import adminRoutes from "./routes/admin.js";
import connectDB from "./config/db.js";
import { generateSignature } from "./controllers/cloudinaryUpload.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* DataBase Connection */
const PORT = process.env.PORT || 5001;
connectDB();

/* Cloudinary Configuration when user upload image or videos */
app.post("/uploadfile", generateSignature);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/task", taskRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
