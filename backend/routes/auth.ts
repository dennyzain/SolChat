import { Router } from "express";
import { challengeFunction, verifyFunction } from "../controllers/auth";
const router = Router();

router.post("/challenge", challengeFunction);
router.post("/verify", verifyFunction);

export default router;