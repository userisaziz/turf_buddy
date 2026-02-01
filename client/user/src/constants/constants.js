const CITIES = [
    "Mumbai", "Bijapur", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
    "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Kanpur", "Nagpur", "Indore",
    "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", 'Gulbarga'
];
CITIES.sort((a, b) => a.localeCompare(b));

const PATHS = {
    // Public routes (relative to /:city)
    HOME: "",
    TURFS: "turfs",
    TURF_DETAILS: "turf/:id",
    CONTACT_US: "contact-us",
    LOGIN: "login",
    SIGNUP: "signup",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password/:token",

    // Auth routes (relative to /auth/:city)
    AUTH_ROOT: "/auth",
    AUTH_TURFS: "turfs",
    RESERVE: "reserve/:id",
    BECOME_OWNER: "become-owner",
    BOOKING_HISTORY: "booking-history",
    TOURNAMENTS: "tournaments",
    TOURNAMENT_REGISTER: "tournaments/register/:tournamentId",
    TOURNAMENT_DETAILS: "tournaments/:tournamentId",
    COACHINGS: "coachings",
    COACHING_DETAILS: "coachings/:coachingId",
};

export { CITIES, PATHS };