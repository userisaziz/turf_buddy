
import mongoose from "mongoose";
import FixedSchedule from "./models/fixedSchedule.model.js";
import Turf from "./models/turf.model.js";

const MONGO_URI = "mongodb+srv://azizadnan370:qTqPcN354GJwwM6p@cluster0.uu7dc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check all FixedSchedules
        const allSchedules = await FixedSchedule.find({});
        console.log(`Total FixedSchedules: ${allSchedules.length}`);

        // Group by Turf
        const turfCounts = {};
        for (const s of allSchedules) {
            const tid = s.turf.toString();
            turfCounts[tid] = (turfCounts[tid] || 0) + 1;
        }
        console.log('Schedules per turf:', turfCounts);

        if (allSchedules.length > 0) {
            console.log('Sample Schedule:', JSON.stringify(allSchedules[0], null, 2));
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
