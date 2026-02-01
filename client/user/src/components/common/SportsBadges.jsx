import React from "react";

const SportBadges = ({ turf }) => {
  // Single source of truth for icon size & color
  const iconClass = "w-4 h-4 text-green-700";

  const getSportIcon = (sportName) => {
    const sport = sportName.toLowerCase();

    switch (sport) {
      case "cricket":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 512 512"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M506.622,39.527L470.119,3.024c-4.032-4.032-10.565-4.032-14.597,0l-91.797,91.797
            c-16.019-10.454-37.753-8.649-51.806,5.424L5.378,406.785c-4.032,4.032-4.032,10.565,0,14.597l87.593,87.593
            c2.016,2.016,4.657,3.024,7.299,3.024c2.641,0,5.282-1.008,7.299-3.024l92.215-92.215
            c13.256,16.518,33.592,27.123,56.368,27.123c39.84,0,72.26-32.42,72.26-72.26
            c0-0.474-0.028-0.943-0.038-1.416c-1.22-38.781-33.134-69.967-72.202-69.967
            c-39.84,0-72.26,32.42-72.26,72.26c0,9.431,1.835,18.433,5.134,26.699
            L100.27,487.08l-72.996-72.996l299.242-299.242
            c8.065-8.085,21.16-8.115,29.184-0.091l1.31,1.449
            c1.936,1.956,4.567,3.183,7.309,3.183
            c2.742,0,5.363-1.217,7.299-3.153l91.182-91.245
            l21.906,21.873-91.182,91.167c-4.032,4.032-4.032,10.557,0,14.59
            l6.018,6.013c8.034,8.045,8.034,21.127-0.01,29.172l-96.737,96.727
            c-4.032,4.032-4.032,10.562,0,14.597
            c4.032,4.03,10.565,4.03,14.597-0.003l96.737-96.727
            c7.792-7.792,12.087-18.156,12.097-29.184
            c0-10.413-3.831-20.252-10.837-27.874l91.212-91.212
            C510.654,50.092,510.654,43.56,506.622,39.527z" />
          </svg>
        );

      case "football":
      case "soccer":
        return (
          <svg
            className={iconClass}
            viewBox="0 0 512 512"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256,0C114.841,0,0,114.841,0,256s114.841,256,256,256s256-114.841,256-256
            S397.159,0,256,0zM256,492.308c-130.363,0-236.308-105.946-236.308-236.308
            S125.637,19.692,256,19.692S492.308,125.637,492.308,256
            S386.363,492.308,256,492.308z" />
          </svg>
        );

      case "badminton":
        return (
          <svg
            className="w-4 h-4 stroke-current text-green-700"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3L8 10H16L12 3Z" strokeWidth="2" />
            <circle cx="12" cy="14" r="3" strokeWidth="2" />
            <path d="M9 14L7 20M12 17V21M15 14L17 20" strokeWidth="2" />
          </svg>
        );

      default:
        return (
          <svg
            className="w-4 h-4 stroke-current text-green-700"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 9C6 6.79 7.79 5 10 5H14C16.21 5 18 6.79 18 9V11
            C18 13.21 16.21 15 14 15H10C7.79 15 6 13.21 6 11V9Z"
              strokeWidth="2"
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {turf?.sportTypes?.map((sport, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1
          bg-green-100 text-green-800 rounded-full text-sm font-medium"
        >
          {getSportIcon(sport)}
          {sport}
        </span>
      ))}
    </div>
  );
};

export default SportBadges;
