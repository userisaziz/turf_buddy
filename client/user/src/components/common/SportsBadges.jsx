import React from "react";

const SportBadges = ({ turf }) => {
    const iconClass = "w-4 h-4 stroke-current";

    const getSportIcon = (sportName) => {
        const sport = sportName.toLowerCase();

        switch (sport) {
            case "cricket":
                // Cricket bat + ball
                return (
                    <svg
                        className={iconClass}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 17L7 13M7 13L15 5L19 9L11 17L7 13Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="18" cy="18" r="3" strokeWidth="2" />
                    </svg>
                );

            case "football":
            case "soccer":
                // Football (hex pattern)
                return (
                    <svg
                        className={iconClass}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="9" strokeWidth="2" />
                        <path
                            d="M12 3V6M12 3L9.5 5.5M12 3L14.5 5.5M12 21V18M12 21L9.5 18.5M12 21L14.5 18.5M3 12H6M3 12L5.5 9.5M3 12L5.5 14.5M21 12H18M21 12L18.5 9.5M21 12L18.5 14.5"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                );

            case "badminton":
                // Shuttlecock
                return (
                    <svg
                        className={iconClass}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 3L8 10H16L12 3Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="12" cy="14" r="3" strokeWidth="2" />
                        <path
                            d="M9 14L7 20M12 17V21M15 14L17 20"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                );

            default:
                // Generic sports / trophy
                return (
                    <svg
                        className={iconClass}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 9C6 6.79086 7.79086 5 10 5H14C16.2091 5 18 6.79086 18 9V11C18 13.2091 16.2091 15 14 15H10C7.79086 15 6 13.2091 6 11V9Z"
                            strokeWidth="2"
                        />
                        <path
                            d="M6 9H4C3.44772 9 3 9.44772 3 10V11C3 11.5523 3.44772 12 4 12H6M18 9H20C20.5523 9 21 9.44772 21 10V11C21 11.5523 20.5523 12 20 12H18"
                            strokeWidth="2"
                        />
                        <path
                            d="M12 15V18M12 18H9V20H15V18H12Z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                );
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {turf.sportTypes.map((sport, index) => (
                <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                    {getSportIcon(sport)}
                    {sport}
                </span>
            ))}
        </div>
    );
};

export default SportBadges;