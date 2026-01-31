import mongoose from "mongoose";

const coachingEnquirySchema = new mongoose.Schema(
    {
        coaching: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coaching",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Enquiry details
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },

        // Student details (optional)
        studentName: { type: String },
        studentAge: { type: Number },

        status: {
            type: String,
            enum: ["pending", "contacted", "enrolled", "rejected"],
            default: "pending",
        },

        // Owner's response/notes
        ownerNotes: { type: String },
        respondedAt: { type: Date },
    },
    { timestamps: true }
);

// Prevent duplicate enquiries from same user for same coaching
coachingEnquirySchema.index({ coaching: 1, user: 1 }, { unique: true });

const CoachingEnquiry = mongoose.model("CoachingEnquiry", coachingEnquirySchema);

export default CoachingEnquiry;
