import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./src/db/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routers/auth.js";
import appointmentRoutes from "./src/routers/appointments.js";
import catalogRoutes from "./src/routers/catalog.js";
import usersRoutes from "./src/routers/users.js";
import statusRoutes from "./src/routers/status.js";
import vendorRoutes from "./src/routers/vendor.js";
import imageRoutes from "./src/routers/image.js";
import clientRoutes from "./src/routers/client.js";
import apptRelationRoutes from "./src/routers/appointmentRelations.js";
import serviceRoutes from "./src/routers/service.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();
const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/img", imageRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/apptRelation", apptRelationRoutes);
app.use("/api/service", serviceRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, msg: "An error has occurred" });
  }
  next();
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
