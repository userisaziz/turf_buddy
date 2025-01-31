import { useState, useEffect } from "react"; // Add useEffect
import TurfCard from "./TurfCard.jsx";
import TurfCardSkeleton from "../ui/TurfCardSkeleton.jsx";
import useTurfData from "../../hooks/useTurfData.jsx";
import SearchTurf from "../search/SearchTurf.jsx";
import { Filter } from "lucide-react"; // Import Lucide React filter icon

const Turf = () => {
  const { turfs, loading, error } = useTurfData();
  const [filteredTurfs, setFilteredTurfs] = useState([]); // Initialize as empty array
  const [regionFilter, setRegionFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  // Sync filteredTurfs with turfs when data is fetched
  useEffect(() => {
    if (turfs.length > 0) {
      setFilteredTurfs(turfs);
    }
  }, [turfs]); // Run this effect whenever turfs changes

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    const filtered = turfs.filter(
      (turf) =>
        turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turf.sportTypes.some((sport) =>
          sport.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTurfs(filtered);
  };

  // Handle region filter
  const handleRegionFilter = (region) => {
    setRegionFilter(region);
  };

  // Handle sorting by price
  const handleSortByPrice = (order) => {
    setSortBy(order);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setRegionFilter("");
    setSortBy("");
    setFilteredTurfs(turfs); // Reset to all turfs
    setAppliedFiltersCount(0);
  };

  // Apply filters and close modal
  const applyFilters = () => {
    let filtered = turfs;

    // Apply region filter
    if (regionFilter) {
      filtered = filtered.filter(
        (turf) => turf.region.toLowerCase() === regionFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "asc") {
          return a.pricePerHour - b.pricePerHour;
        } else {
          return b.pricePerHour - a.pricePerHour;
        }
      });
    }

    setFilteredTurfs(filtered);
    setAppliedFiltersCount(regionFilter || sortBy ? 1 : 0); // Update badge count
    closeFiltersModal();
  };

  // Open filters modal
  const openFiltersModal = () => {
    setIsFiltersModalOpen(true);
  };

  // Close filters modal
  const closeFiltersModal = () => {
    setIsFiltersModalOpen(false);
  };

  if (error) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Discover Turfs</h1>

      {/* Search Bar */}
      <div>
        <SearchTurf onSearch={handleSearch} openFiltersModal={openFiltersModal} />
      </div>

      {/* Filters Modal */}
      {isFiltersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Region Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                value={regionFilter}
                onChange={(e) => handleRegionFilter(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">All Regions</option>
                <option value="Hagarga">Hagarga</option>
                <option value="Saidapuri">Saidapuri</option>
                <option value="Nagnahalli">Nagnahalli</option>
                <option value="Kbn">Kbn</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sort by Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortByPrice(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Sort By Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={handleResetFilters}
                className="btn btn-outline"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turf Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <TurfCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => <TurfCard key={turf._id} turf={turf} />)
        ) : (
          <div className="col-span-full text-center text-gray-600">
            <p className="text-2xl font-semibold">No Turfs Found</p>
            <p className="mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Turf;