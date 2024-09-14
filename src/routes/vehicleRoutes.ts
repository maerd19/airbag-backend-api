import express from "express";
import {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";
import { validateVehicle } from "../middleware/validation";

const router = express.Router();

router.post("/", validateVehicle, createVehicle);
router.get("/:id", getVehicle);
router.put("/:id", validateVehicle, updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
