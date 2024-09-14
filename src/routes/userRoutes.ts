import express from "express";
import { createUser, getUser } from "../controllers/userController";
import { validateUser } from "../middleware/validation";

const router = express.Router();

router.post("/", validateUser, createUser);
router.get("/:id", getUser);

export default router;
