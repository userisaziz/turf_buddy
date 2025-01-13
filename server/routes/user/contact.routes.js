import { Router } from "express";
import { sendMessage } from "../../controllers/user/contact.controller.js";

const contactRouter = Router();
contactRouter.post("/send-msg", sendMessage);

export default contactRouter;
