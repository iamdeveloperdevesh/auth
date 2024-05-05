import { register, login, handleLogout } from "../controllers/auth.js";
import { getUserDetails, deleteUser } from "../controllers/user.js";
import express from "express";
import { HandleAsyncError } from "../middleware/catchError.js";
import { loginValidations, registerValidations } from "../middleware/validator.js";
import { verifyToken } from "../middleware/authorise.js";

/* Routes */
const router = express.Router();

//Authentication routes
router.post("/auth/signup", registerValidations, HandleAsyncError(register));
router.post("/auth/login", loginValidations, HandleAsyncError(login));
router.get("/auth/logout", HandleAsyncError(handleLogout));

//Authorise/Protected routes
router.use(verifyToken);
router.get("/user/getUserDetails", HandleAsyncError(getUserDetails));
router.get("/user/getUserDetails/:id", HandleAsyncError(getUserDetails));

router.delete("/user/deleteUser", HandleAsyncError(deleteUser));

export default router;