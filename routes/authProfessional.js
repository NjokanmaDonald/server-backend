import express from "express";
import { register, approval, login } from "../controllers/authProfessional.js";

const router = express.Router();

router.post("/register", register)
router.get("/approval/:id", approval)
router.post("/login", login)

export default router

