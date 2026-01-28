import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { Capacitor } from "@capacitor/core";

export default function NavbarLayout({ homePath, items, endContent }) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const isNativeMobile = Capacitor.isNativePlatform();

    return (
        <>
            {/* Desktop Navbar */}
            <div className="navbar bg-base-100 fixed top-0 z-50 shadow-md animate-slide-in-top hidden lg:flex">
                <div className="navbar-start">
                    <Link to={homePath} className="btn btn-ghost normal-case text-xl">
                        <img
                            src="/logo.png"
                            alt="TurfBuddy"
                            className="h-10 w-10 mask mask-squircle"
                        />
                        TurfBuddy
                    </Link>
                </div>
                <div className="navbar-center">
                    <ul className="menu menu-horizontal px-1">
                        {items
                            .filter((item) => !item.mobileOnly)
                            .map((item, idx) => (
                                <li key={idx}>
                                    {item.render ? (
                                        item.render(isActive(item.path))
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={isActive(item.path) ? "active" : ""}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="navbar-end">
                    <ThemeSwitcher />
                    {endContent}
                </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="navbar bg-base-100 fixed top-0 z-50 shadow-sm lg:hidden min-h-[4rem] pt-[env(safe-area-inset-top)]">
                <div className="navbar-start">
                    <Link
                        to={homePath}
                        className="btn btn-ghost normal-case text-xl px-2"
                    >
                        <img
                            src="/logo.png"
                            alt="TurfBuddy"
                            className="h-8 w-8 mask mask-squircle"
                        />
                        TurfBuddy
                    </Link>
                </div>
                <div className="navbar-end">
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Mobile Bottom Navigation (Native App Only) */}
            <div
                className="
        btm-nav
        lg:hidden
        z-50
        bg-base-100
        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
        pb-[env(safe-area-inset-bottom)]
        h-[calc(4rem+env(safe-area-inset-bottom))]
      "
            >
                {items
                    .filter((item) => !item.desktopOnly)
                    .map((item, idx) => {
                        const active = isActive(item.path);
                        const baseClass = "text-base-content/70";
                        const activeClass = "active text-primary";

                        if (item.onClick) {
                            return (
                                <button
                                    key={idx}
                                    onClick={item.onClick}
                                    className={baseClass}
                                >
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    <span className="btm-nav-label text-xs mt-1">
                                        {item.mobileLabel || item.label}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                className={active ? activeClass : baseClass}
                            >
                                {item.icon && <item.icon className="h-5 w-5" />}
                                <span className="btm-nav-label text-xs mt-1">
                                    {item.mobileLabel || item.label}
                                </span>
                            </Link>
                        );
                    })}
            </div>

        </>
    );
}

NavbarLayout.propTypes = {
    homePath: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            path: PropTypes.string,
            icon: PropTypes.elementType,
            mobileOnly: PropTypes.bool,
            desktopOnly: PropTypes.bool,
            onClick: PropTypes.func,
            render: PropTypes.func,
            mobileLabel: PropTypes.string,
        })
    ).isRequired,
    endContent: PropTypes.node,
};
