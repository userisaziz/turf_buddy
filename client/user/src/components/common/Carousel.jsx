import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  Parallax
} from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

// Assets
import banner1 from "/banner1.jpg";
import banner2 from "/banner2.jpg";
import banner3 from "/banner3.jpg";

// Styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Configuration
const SWIPER_CONFIG = {
  speed: 1400,
  loop: true,
  effect: "fade",
  parallax: true,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
  },
  pagination: {
    clickable: true,
    el: ".custom-pagination",
  },
  navigation: {
    prevEl: ".nav-prev",
    nextEl: ".nav-next",
  },
  modules: [Autoplay, EffectFade, Navigation, Pagination, Parallax],
};

const SLIDES = [
  // {
  //   id: 1,
  //   image: banner1,
  //   subtitle: "PLAY. BOOK. REPEAT.",
  //   title: "Book Premium \nSports Turfs Instantly",
  //   description:
  //     "Discover and book football, cricket, and multi-sport turfs near you with real-time availability.",
  //   cta: "Find Turfs",
  // },
  {
    id: 2,
    image: banner2,
    subtitle: "SMART TURF MANAGEMENT",
    title: "One Platform \nFor Turf Owners",
    description:
      "Manage slots, pricing, and bookings seamlessly with Turf Buddy’s owner dashboard.",
    cta: "List Your Turf",
  },
  {
    id: 3,
    image: banner3,
    subtitle: "ANYTIME. ANYWHERE.",
    title: "Night & Day \nSlot Booking",
    description:
      "Flexible half-hour slots with separate day and night pricing for maximum convenience.",
    cta: "Book a Slot",
  },
];

const HomeSlider = ({ isLoggedIn = false }) => {
  return (
    <section className="relative w-full group overflow-hidden bg-background">
      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-20 hidden lg:flex gap-4">
        <button
          className="nav-prev w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:bg-primary hover:border-primary transition text-white"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="nav-next w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:bg-primary hover:border-primary transition text-white"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <Swiper {...SWIPER_CONFIG} className="w-full h-[70vh] md:h-[85vh]">
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 w-full h-full"
              data-swiper-parallax="25%"
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
              <div className="max-w-4xl">
                {/* Subtitle */}
                <span
                  className="inline-flex items-center gap-3 text-xs md:text-sm font-bold tracking-[0.4em] text-primary uppercase mb-6"
                  data-swiper-parallax="-200"
                >
                  <span className="w-8 h-px bg-primary" />
                  {slide.subtitle}
                </span>

                {/* Title */}
                <h2
                  className="text-4xl md:text-8xl font-bold text-white mb-8 leading-[1.1] whitespace-pre-line"
                  data-swiper-parallax="-400"
                >
                  {slide.title}
                </h2>

                <div data-swiper-parallax="-600" className="space-y-10">
                  <p className="text-lg md:text-xl text-gray-300 max-w-lg border-l-2 border-primary/40 pl-6">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-6 items-center">
                    <Link
                      to={isLoggedIn ? "/auth/turfs" : "/signup"}
                      className="btn btn-accent"
                    >
                      Get Started
                    </Link>

                    <Link to="/turfs">
                      <button className="flex items-center gap-3 text-white/80 hover:text-white transition group">
                        <span className="text-sm tracking-widest uppercase border-b border-white/20 pb-1">
                          Explore Nearby Turfs
                        </span>
                        <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Container */}
      <div className="custom-pagination absolute bottom-12 left-12 z-20 w-auto" />
    </section>
  );
};

HomeSlider.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default memo(HomeSlider);