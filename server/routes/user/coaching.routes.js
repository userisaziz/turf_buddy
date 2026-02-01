import { Router } from "express";
import {
    getCoachings,
    getCoachingById,
    getCoachingsByTurf,
    sendEnquiry,
    getUserEnquiries
} from "../../controllers/user/coaching.controller.js";
import verifyUserToken from "../../middleware/jwt/user.middleware.js";

const coachingRouter = Router();

// Public routes
coachingRouter.get("/all/:city?", getCoachings);
coachingRouter.get("/details/:coachingId", getCoachingById);
coachingRouter.get("/turf/:turfId", getCoachingsByTurf);

// Protected routes (requires authentication)
coachingRouter.post("/enquiry/:coachingId", verifyUserToken, sendEnquiry);
coachingRouter.get("/my-enquiries", verifyUserToken, getUserEnquiries);

export default coachingRouter;
