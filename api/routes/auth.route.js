import { signUP,signIn,google,signOut } from "../controllers/auth.controller.js";

import express from "express"

const router = express.Router();

router.post("/signup",signUP);
router.post("/signin",signIn);
router.post("/google",google);
router.get("/signout",signOut)
export default router;