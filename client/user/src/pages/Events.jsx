import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TournamentCard from "../components/tournament/TournamentCard";
import CoachingCard from "../components/tournament/CoachingCard";
import useTournamentData from "../hooks/useTournamentData";
import useCoachingData from "../hooks/useCoachingData";
import { PATHS } from "../constants/constants";
import banner3 from "/banner3.jpg";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Trophy, Users, Calendar, SearchX, ArrowLeft, Filter } from "lucide-react";
import SearchTurf from "../components/search/SearchTurf";
import Button from "../components/common/Button";

const Events = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(location.state?.tab || "tournaments");
    const { tournaments, loading: tournamentLoading, error: tournamentError } = useTournamentData();
    const { coachings, loading: coachingLoading, error: coachingError } = useCoachingData();
    const { city } = useParams();
    const citySlug = city?.toLowerCase() || "";
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    // Filter and search states
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    const [filteredCoachings, setFilteredCoachings] = useState([]);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
    const [sportsTypeFilter, setSportsTypeFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Sync initial lists
    useEffect(() => {
        if (tournaments) setFilteredTournaments(tournaments);
    }, [tournaments]);

    useEffect(() => {
        if (coachings) setFilteredCoachings(coachings);
    }, [coachings]);

    // Handle global search
    const handleSearch = (term) => {
        setSearchTerm(term);
        const lowerTerm = term.toLowerCase();

        // Search Tournaments
        const searchedTournaments = tournaments.filter(t =>
            t.name.toLowerCase().includes(lowerTerm) ||
            (t.sportsType && t.sportsType.toLowerCase().includes(lowerTerm))
        );
        setFilteredTournaments(searchedTournaments);

        // Search Coaching
        const searchedCoachings = coachings.filter(c =>
            c.name.toLowerCase().includes(lowerTerm) ||
            (c.sportsType && c.sportsType.toLowerCase().includes(lowerTerm)) ||
            c.coachName.toLowerCase().includes(lowerTerm)
        );
        setFilteredCoachings(searchedCoachings);
    };

    const applyFilters = () => {
        let ft = tournaments;
        let fc = coachings;

        if (sportsTypeFilter) {
            ft = ft.filter(t => t.sportsType?.toLowerCase() === sportsTypeFilter.toLowerCase());
            fc = fc.filter(c => c.sportsType?.toLowerCase() === sportsTypeFilter.toLowerCase());
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            ft = ft.filter(t => t.name.toLowerCase().includes(lowerTerm));
            fc = fc.filter(c => c.name.toLowerCase().includes(lowerTerm));
        }

        setFilteredTournaments(ft);
        setFilteredCoachings(fc);
        setIsFiltersModalOpen(false);
    };

    const handleResetFilters = () => {
        setSportsTypeFilter("");
        setFilteredTournaments(tournaments);
        setFilteredCoachings(coachings);
        setIsFiltersModalOpen(false);
    };

    const getCityPath = (basePath) => {
        return isLoggedIn
            ? `/auth/${citySlug || 'mumbai'}/${basePath}`
            : citySlug
                ? `/${citySlug}/${basePath}`
                : `/${basePath}`;
    };

    const handleTournamentClick = (tournamentId) => {
        const path = PATHS.TOURNAMENT_DETAILS.replace(':tournamentId', tournamentId);
        navigate(getCityPath(path));
    };

    const handleCoachingClick = (coachingId) => {
        const path = PATHS.COACHING_DETAILS.replace(':coachingId', coachingId);
        navigate(getCityPath(path));
    };

    return (
        <div className="min-h-screen bg-base-100 pb-20 pt-10">
            <Helmet>
                <title>Events & Coaching in {city || 'Your City'} | Turf Buddy</title>
                <meta name="description" content={`Discover sports tournaments and coaching classes in ${city}. Join now to improve your skills and compete.`} />
            </Helmet>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Standardized Header Style from Turf.jsx */}
                <h1 className="text-3xl font-bold text-center mb-8">Discover Events</h1>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchTurf
                        onSearch={handleSearch}
                        openFiltersModal={() => setIsFiltersModalOpen(true)}
                        placeholder="Search for events, sports or coaches..."
                    />
                </div>

                {/* Filters Modal */}
                {isFiltersModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-base-100 p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-base-300 animate-scale-up">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                <Filter className="w-6 h-6 text-primary" /> Filter Events
                            </h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2 ml-1">Sports Type</label>
                                <select
                                    value={sportsTypeFilter}
                                    onChange={(e) => setSportsTypeFilter(e.target.value)}
                                    className="select select-bordered w-full rounded-xl focus:select-primary"
                                >
                                    <option value="">All Sports</option>
                                    <option value="Football">Football</option>
                                    <option value="Cricket">Cricket</option>
                                    <option value="Badminton">Badminton</option>
                                    <option value="Tennis">Tennis</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleResetFilters}
                                    className="btn btn-ghost flex-1 rounded-xl"
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={applyFilters}
                                    className="btn btn-primary flex-1 rounded-xl shadow-lg shadow-primary/30"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Switcher - Kept for Events/Coaching separation */}
                <div className="flex justify-center mb-10">
                    <div className="bg-base-200/50 backdrop-blur-md p-1.5 rounded-2xl inline-flex gap-1 border border-base-300">
                        <button
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "tournaments"
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "hover:bg-base-300 text-base-content/70"
                                }`}
                            onClick={() => setActiveTab("tournaments")}
                        >
                            <Trophy className={`w-5 h-5 ${activeTab === "tournaments" ? "animate-bounce" : ""}`} />
                            Tournaments
                        </button>
                        <button
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "coaching"
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "hover:bg-base-300 text-base-content/70"
                                }`}
                            onClick={() => setActiveTab("coaching")}
                        >
                            <Users className={`w-5 h-5 ${activeTab === "coaching" ? "animate-pulse" : ""}`} />
                            Coaching
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-slide-in-bottom">
                    {activeTab === "tournaments" ? (
                        <div key="tournaments-view">
                            {tournamentLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-base-200 animate-pulse h-[400px] w-full rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : tournamentError ? (
                                <div className="max-w-md mx-auto text-center py-20">
                                    <div className="bg-error/10 text-error p-6 rounded-3xl border border-error/20 flex flex-col items-center">
                                        <SearchX className="w-16 h-16 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                                        <p className="opacity-80">{tournamentError}</p>
                                    </div>
                                </div>
                            ) : filteredTournaments.length === 0 ? (
                                <div className="text-center py-32 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-base-300/50 rounded-full flex items-center justify-center mb-6">
                                        <Calendar className="w-12 h-12 text-base-content/20" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-base-content/40 mb-2">No Tournaments found</h3>
                                    <p className="text-base-content/30 text-lg">Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredTournaments.map((tournament) => (
                                        <TournamentCard
                                            key={tournament._id}
                                            tournament={tournament}
                                            image={banner3}
                                            onClick={() => handleTournamentClick(tournament._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div key="coaching-view">
                            {coachingLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-base-200 animate-pulse h-[400px] w-full rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : coachingError ? (
                                <div className="max-w-md mx-auto text-center py-20">
                                    <div className="bg-error/10 text-error p-6 rounded-3xl border border-error/20 flex flex-col items-center">
                                        <SearchX className="w-16 h-16 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                                        <p className="opacity-80">{coachingError}</p>
                                    </div>
                                </div>
                            ) : filteredCoachings.length === 0 ? (
                                <div className="text-center py-32 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-base-300/50 rounded-full flex items-center justify-center mb-6">
                                        <Users className="w-12 h-12 text-base-content/20" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-base-content/40 mb-2">No Coaching found</h3>
                                    <p className="text-base-content/30 text-lg">Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredCoachings.map((coaching) => (
                                        <CoachingCard
                                            key={coaching._id}
                                            coaching={coaching}
                                            onClick={() => handleCoachingClick(coaching._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Events;


