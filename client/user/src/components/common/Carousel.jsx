import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroStatic({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative
        min-h-[50vh]
        md:min-h-[70vh]
        bg-black
        text-white
        overflow-hidden
      "
    >
      {/* Background Image */}
      <img
        src="/banner3.jpg"
        alt="Book Sports Turfs"
        className="absolute inset-0 w-full h-full object-cover"
        fetchpriority="high"
        loading="eager"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />

      {/* Content */}
      <div
        className="
          relative z-10
          max-w-7xl mx-auto
          px-6
          h-full
          flex
          items-start md:items-center
          pt-4
        "
      >
        <div className="max-w-xl space-y-6 md:space-y-8">
          <span className="tracking-[0.3em] text-primary text-xs font-medium">
            PLAY. BOOK. REPEAT.
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Book Premium
            <br />
            Sports Turfs Instantly
          </h1>

          <p className="text-gray-300 text-base md:text-lg">
            Discover and book football, cricket, and multi-sport turfs near you.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="
                px-6 py-3
                bg-primary text-white
                rounded-lg font-medium
                hover:bg-primary/90
                transition-colors
              "
              onClick={() =>
                navigate(isLoggedIn ? "/auth/turfs" : "/signup")
              }
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/turfs")}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              Explore Turfs <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
