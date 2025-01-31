import { Filter } from "lucide-react";
import   { useState } from "react";

const SearchTurf = ({ onSearch,openFiltersModal }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="flex gap-4 items-center justify-center">

    <form onSubmit={handleSearch} className="flex w-full max-w-xl ml-auto mb-4  ">
      <input
        type="text"
        placeholder="Search for turfs..."
        className="input input-bordered w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="btn btn-primary ml-2">
        Search
      </button>

    </form>
    <div className="flex justify-center mb-4 relative"  >
        <button
          onClick={openFiltersModal}
          className="btn btn-outline "
        >
          <Filter className="w-5 h-5" /> {/* Lucide React filter icon */}
        
        </button>
      </div>
    </div>
  );
};

export default SearchTurf;
