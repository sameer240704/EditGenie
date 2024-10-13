import express from "express";
import { loginUser, registerUser, checkAuthentication, getUserById, logoutUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/login", loginUser);
router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registerUser
);
router.get("/checkAuth", checkAuthentication);
router.get("/getUser/:userId", getUserById);
router.post("/logout", logoutUser);

export default router;