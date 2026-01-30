import { Home, LayoutGrid, Trophy, CalendarCheck, MessageSquare, LogIn, LogOut } from "lucide-react";
import { PATHS } from "./constants";

/**
 * Centered configuration for navigation items to ensure DRY principles.
 * @param {string} citySlug - The current city slug
 * @param {boolean} isAuth - Whether the user is authenticated
 * @param {function} handleLogout - Logout handler function
 * @returns {Array} Navigation items
 */
export const getNavItems = (citySlug, isAuth, handleLogout) => {
    const cityPrefix = citySlug ? `/${citySlug}` : "";
    const authPrefix = `/auth/${citySlug || "mumbai"}`; // mumbai is default fallback

    if (isAuth) {
        return [
            { label: "Home", path: authPrefix, icon: Home },
            { label: "Turfs", path: `${authPrefix}/${PATHS.TURFS}`, icon: LayoutGrid },
            {
                label: "Tournaments",
                path: `${authPrefix}/${PATHS.TOURNAMENTS}`,
                icon: Trophy,
                mobileLabel: "Events",
            },
            {
                label: "My Bookings",
                path: `${authPrefix}/${PATHS.BOOKING_HISTORY}`,
                icon: CalendarCheck,
                mobileLabel: "Bookings",
            },
            {
                label: "Become an Owner",
                path: `${authPrefix}/${PATHS.BECOME_OWNER}`,
                desktopOnly: true,
            },
            {
                label: "Logout",
                icon: LogOut,
                onClick: handleLogout,
                mobileOnly: true,
            },
        ];
    }

    return [
        { label: "Home", path: cityPrefix || "/", icon: Home },
        { label: "Turfs", path: citySlug ? `${cityPrefix}/${PATHS.TURFS}` : `/${PATHS.TURFS}`, icon: LayoutGrid },
        {
            label: "Contact Us",
            path: `/${PATHS.CONTACT_US}`,
            icon: MessageSquare,
            mobileLabel: "Contact",
        },
        { label: "Login", path: `/${PATHS.LOGIN}`, icon: LogIn },
    ];
};
