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

    const commonItems = [
        { label: "Home", path: isAuth ? authPrefix : (cityPrefix || "/"), icon: Home },
        { label: "Turfs", path: isAuth ? `${authPrefix}/${PATHS.TURFS}` : (citySlug ? `${cityPrefix}/${PATHS.TURFS}` : `/${PATHS.TURFS}`), icon: LayoutGrid },
        {
            label: "Events",
            path: isAuth ? `${authPrefix}/${PATHS.TOURNAMENTS}` : (citySlug ? `${cityPrefix}/${PATHS.TOURNAMENTS}` : `/${PATHS.TOURNAMENTS}`),
            icon: Trophy,
            mobileLabel: "Events",
        },
        {
            label: "Become an Owner",
            path: isAuth ? `${authPrefix}/${PATHS.BECOME_OWNER}` : (citySlug ? `${cityPrefix}/${PATHS.BECOME_OWNER}` : `/${PATHS.BECOME_OWNER}`),
            desktopOnly: true,
        },
    ];

    if (isAuth) {
        return [
            ...commonItems,
            {
                label: "My Bookings",
                path: `${authPrefix}/${PATHS.BOOKING_HISTORY}`,
                icon: CalendarCheck,
                mobileLabel: "Bookings",
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
        ...commonItems,
        {
            label: "Contact Us",
            path: `/${PATHS.CONTACT_US}`,
            icon: MessageSquare,
            mobileLabel: "Contact",
        },
        { label: "Login", path: `/${PATHS.LOGIN}`, icon: LogIn },
    ];
};
