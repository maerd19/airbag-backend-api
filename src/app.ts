import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";

dotenv.config();

const app: Application = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
  res.send("Airbag Backend API");
});

export default app;
