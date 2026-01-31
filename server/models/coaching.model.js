import mongoose from "mongoose";

const coachingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        coachName: { type: String, required: true },
        coachPhone: { type: String, required: true },
        coachEmail: { type: String },
        sportsType: { type: String, required: true },

        // Time slot for coaching (e.g., "4:00 PM - 5:00 PM")
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },

        // Days of the week coaching happens
        daysOfWeek: [{
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true
        }],

        // Term period
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        termDuration: {
            type: Number,
            default: 6, // 6 months default
            required: true
        },

        // Pricing
        monthlyFee: { type: Number, required: true },
        registrationFee: { type: Number, default: 0 },

        // Capacity
        maxStudents: { type: Number, required: true },
        currentStudents: { type: Number, default: 0 },

        // Age group
        ageGroup: {
            minAge: { type: Number },
            maxAge: { type: Number }
        },

        // What's included
        includes: [{ type: String }],

        status: {
            type: String,
            enum: ["active", "inactive", "completed"],
            default: "active",
        },

        // Associated turf
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turf",
            required: true
        },

        // Owner who created the coaching
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
    },
    { timestamps: true }
);

// Index for efficient city-based queries
coachingSchema.index({ status: 1, startDate: 1, endDate: 1 });

const Coaching = mongoose.model("Coaching", coachingSchema);

export default Coaching;
