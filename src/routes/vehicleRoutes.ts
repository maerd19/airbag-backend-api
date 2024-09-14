import express from "express";
import {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";

const router = express.Router();

router.post("/", createVehicle);
router.get("/:id", getVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
