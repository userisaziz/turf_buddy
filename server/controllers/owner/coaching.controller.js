import Coaching from "../../models/coaching.model.js";
import CoachingEnquiry from "../../models/coachingEnquiry.model.js";
import Turf from "../../models/turf.model.js";

// Create a new coaching class
export const createCoaching = async (req, res) => {
    try {
         const ownerId = req.owner.id;
        // Verify the turf belongs to this owner
        const turf = await Turf.findOne({ _id: req.body.turf, owner: ownerId });
        if (!turf) {
            return res.status(404).json({ message: "Turf not found or doesn't belong to you" });
        }

        // Calculate end date based on term duration (default 6 months)
        const startDate = new Date(req.body.startDate);
        const termDuration = req.body.termDuration || 6;
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + termDuration);

        const coaching = new Coaching({
            ...req.body,
            owner: ownerId,
            endDate: req.body.endDate || endDate,
            termDuration: termDuration
        });

        await coaching.save();

        res.status(201).json({
            success: true,
            message: "Coaching class created successfully",
            coaching
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all coaching classes for the owner
export const getOwnerCoachings = async (req, res) => {
    try {
        const ownerId = req.owner.id;

        const coachings = await Coaching.find({ owner: ownerId })
            .populate("turf", "name image city location")
            .sort({ createdAt: -1 });

        res.status(200).json(coachings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get single coaching details
export const getCoachingById = async (req, res) => {
    try {
        const { coachingId } = req.params;
        const ownerId = req.owner.id;

        const coaching = await Coaching.findOne({ _id: coachingId, owner: ownerId })
            .populate("turf", "name image city location");

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        res.status(200).json(coaching);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update coaching class
export const updateCoaching = async (req, res) => {
    try {
        const { coachingId } = req.params;
        const ownerId = req.owner.id;

        const coaching = await Coaching.findOneAndUpdate(
            { _id: coachingId, owner: ownerId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        res.status(200).json({
            success: true,
            message: "Coaching updated successfully",
            coaching
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle coaching status (active/inactive)
export const toggleCoachingStatus = async (req, res) => {
    try {
        const { coachingId } = req.params;
        const ownerId = req.owner.id;

        const coaching = await Coaching.findOne({ _id: coachingId, owner: ownerId });

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        coaching.status = coaching.status === "active" ? "inactive" : "active";
        await coaching.save();

        res.status(200).json({
            success: true,
            message: `Coaching ${coaching.status === "active" ? "activated" : "deactivated"} successfully`,
            coaching
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete coaching class
export const deleteCoaching = async (req, res) => {
    try {
        const { coachingId } = req.params;
        const ownerId = req.owner.id;

        const coaching = await Coaching.findOneAndDelete({ _id: coachingId, owner: ownerId });

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        // Also delete related enquiries
        await CoachingEnquiry.deleteMany({ coaching: coachingId });

        res.status(200).json({
            success: true,
            message: "Coaching deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all enquiries for owner's coaching classes
export const getCoachingEnquiries = async (req, res) => {
    try {
        const ownerId = req.owner.id;

        // First get all coaching IDs for this owner
        const coachings = await Coaching.find({ owner: ownerId }).select("_id");
        const coachingIds = coachings.map(c => c._id);

        const enquiries = await CoachingEnquiry.find({ coaching: { $in: coachingIds } })
            .populate("coaching", "name sportsType")
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json(enquiries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get enquiries for specific coaching
export const getEnquiriesByCoaching = async (req, res) => {
    try {
        const { coachingId } = req.params;
        const ownerId = req.owner.id;

        // Verify coaching belongs to owner
        const coaching = await Coaching.findOne({ _id: coachingId, owner: ownerId });
        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        const enquiries = await CoachingEnquiry.find({ coaching: coachingId })
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json(enquiries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update enquiry status
export const updateEnquiryStatus = async (req, res) => {
    try {
        const { enquiryId } = req.params;
        const { status, ownerNotes } = req.body;
        const ownerId = req.owner.id;

        // Get the enquiry and verify it belongs to owner's coaching
        const enquiry = await CoachingEnquiry.findById(enquiryId).populate("coaching");

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        if (enquiry.coaching.owner.toString() !== ownerId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        enquiry.status = status;
        if (ownerNotes) enquiry.ownerNotes = ownerNotes;
        if (status === "contacted" || status === "enrolled" || status === "rejected") {
            enquiry.respondedAt = new Date();
        }

        await enquiry.save();

        // If enrolled, increment current students
        if (status === "enrolled") {
            await Coaching.findByIdAndUpdate(enquiry.coaching._id, {
                $inc: { currentStudents: 1 }
            });
        }

        res.status(200).json({
            success: true,
            message: "Enquiry status updated successfully",
            enquiry
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
