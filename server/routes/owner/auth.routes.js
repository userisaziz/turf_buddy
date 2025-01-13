import { Router } from "express";
import {
  registerOwner,
  loginOwner,
  ownerRequest,
  forgotOwnerPassword,
  resetOwnerPassword
} from "../../controllers/owner/auth.controller.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateOwnerRequestInput,
} from "../../middleware/validators/owner/authValidator.js";

const authRouter = Router();
authRouter.post("/register", validateRegisterInput, registerOwner);
authRouter.post("/login", validateLoginInput, loginOwner);
authRouter.post("/ownerRequest", validateOwnerRequestInput, ownerRequest);
authRouter.post("/forgot-password", forgotOwnerPassword);
authRouter.post("/reset-password", resetOwnerPassword);
export default authRouter;



