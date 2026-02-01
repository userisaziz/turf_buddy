import { Router } from "express";
import {
    createCoaching,
    getOwnerCoachings,
    getCoachingById,
    updateCoaching,
    toggleCoachingStatus,
    deleteCoaching,
    getCoachingEnquiries,
    getEnquiriesByCoaching,
    updateEnquiryStatus
} from "../../controllers/owner/coaching.controller.js";
import verifyOwnerToken from "../../middleware/jwt/owner.middleware.js";

const coachingRouter = Router();

// All routes require owner authentication
coachingRouter.use(verifyOwnerToken);

// Coaching CRUD
coachingRouter.post("/create", createCoaching);
coachingRouter.get("/all", getOwnerCoachings);
coachingRouter.get("/:coachingId", getCoachingById);
coachingRouter.put("/:coachingId", updateCoaching);
coachingRouter.patch("/:coachingId/toggle-status", toggleCoachingStatus);
coachingRouter.delete("/:coachingId", deleteCoaching);

// Enquiries management
coachingRouter.get("/enquiries/all", getCoachingEnquiries);
coachingRouter.get("/:coachingId/enquiries", getEnquiriesByCoaching);
coachingRouter.patch("/enquiries/:enquiryId", updateEnquiryStatus);

export default coachingRouter;
