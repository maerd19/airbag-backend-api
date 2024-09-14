import express from "express";
import { createUser, getUser, loginUser } from "../controllers/userController";
import { validateUser } from "../middleware/validation";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/", validateUser, createUser);
router.post("/login", loginUser);
router.get("/:id", auth, getUser);

export default router;
