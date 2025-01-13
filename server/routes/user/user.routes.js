import { Router } from "express";
import authRouter from "./auth.routes.js"
import turfRouter from "./turf.routes.js"
import bookingRouter from "./booking.routes.js"
import reviewRouter from "./review.routes.js"
import contactRouter from "./contact.routes.js";


const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/turf", turfRouter);
userRouter.use("/booking", bookingRouter);
userRouter.use("/review", reviewRouter)
userRouter.use("/contact", contactRouter);

export default userRouter;