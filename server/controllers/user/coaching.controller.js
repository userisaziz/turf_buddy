import Coaching from "../../models/coaching.model.js";
import CoachingEnquiry from "../../models/coachingEnquiry.model.js";
import Turf from "../../models/turf.model.js";

// Get all coaching classes (public - filtered by city)
export const getCoachings = async (req, res) => {
    const { city } = req.params;

    try {
        let query = { status: "active" };

        if (city) {
            // Find all turf IDs in the specified city
            const turfsInCity = await Turf.find({ city: city.toLowerCase() }).select("_id");
            const turfIds = turfsInCity.map((t) => t._id);
            query.turf = { $in: turfIds };
        }

        // Only show active coaching that hasn't ended
        query.endDate = { $gte: new Date() };

        const coachings = await Coaching.find(query)
            .populate({
                path: "turf",
                select: "name image city location",
            })
            .sort({ createdAt: -1 });

        res.status(200).json(coachings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get single coaching details (public)
export const getCoachingById = async (req, res) => {
    const { coachingId } = req.params;

    try {
        const coaching = await Coaching.findById(coachingId)
            .populate({
                path: "turf",
                select: "name image city location ownerEmail ownerPhoneNumber",
            });

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found" });
        }

        res.status(200).json(coaching);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get coaching by turf (for blocking time slots)
export const getCoachingsByTurf = async (req, res) => {
    const { turfId } = req.params;

    try {
        const coachings = await Coaching.find({
            turf: turfId,
            status: "active",
            endDate: { $gte: new Date() }
        }).select("startTime endTime daysOfWeek startDate endDate");

        res.status(200).json(coachings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Send enquiry (authenticated users only)
export const sendEnquiry = async (req, res) => {
    const userId = req.user.user;
    const { coachingId } = req.params;
    const { name, email, phone, message, studentName, studentAge } = req.body;

    try {
        // Check if coaching exists and is active
        const coaching = await Coaching.findOne({
            _id: coachingId,
            status: "active"
        });

        if (!coaching) {
            return res.status(404).json({ message: "Coaching not found or not available" });
        }

        // Check if user already sent an enquiry
        const existingEnquiry = await CoachingEnquiry.findOne({
            coaching: coachingId,
            user: userId
        });

        if (existingEnquiry) {
            return res.status(400).json({
                message: "You have already sent an enquiry for this coaching class"
            });
        }

        const enquiry = new CoachingEnquiry({
            coaching: coachingId,
            user: userId,
            name,
            email,
            phone,
            message,
            studentName,
            studentAge
        });

        await enquiry.save();

        res.status(201).json({
            success: true,
            message: "Enquiry sent successfully! The coach will contact you soon.",
            enquiry
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already sent an enquiry for this coaching class"
            });
        }
        res.status(400).json({ message: error.message });
    }
};

// Get user's enquiries
export const getUserEnquiries = async (req, res) => {
    const userId = req.user.user;

    try {
        const enquiries = await CoachingEnquiry.find({ user: userId })
            .populate({
                path: "coaching",
                select: "name sportsType coachName startTime endTime",
                populate: {
                    path: "turf",
                    select: "name city"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(enquiries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
