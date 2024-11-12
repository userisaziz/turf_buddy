import express from "express";
import { registerAdmin } from "../../controllers/admin/auth.controller.js";
import { validateRegisterInput } from "../../middleware/validators/owner/authValidator.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisterInput, registerAdmin);

export default authRouter;
