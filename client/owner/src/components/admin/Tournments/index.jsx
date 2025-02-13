import React, { useState } from "react";
import CreateTournament from "./CreateTournment";
import TournamentList from "./TournamentList";

const Tournament = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Tournament Management
      </h1>

      {/* Tabs Navigation */}
      <div className="flex justify-center mb-1">
        <div className="tabs tabs-boxed bg-gray-100 p-2 rounded-lg">
          <button
            className={`tab text-lg font-semibold ${
              activeTab === "create"
                ? "tab-active bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            } px-6 py-2 rounded-md transition-colors`}
            onClick={() => setActiveTab("create")}
          >
            Create Tournament
          </button>
          <button
            className={`tab text-lg font-semibold ${
              activeTab === "all"
                ? "tab-active bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            } px-6 py-2 rounded-md transition-colors`}
            onClick={() => setActiveTab("all")}
          >
            All Tournaments
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {activeTab === "create" && <CreateTournament />}
        {activeTab === "all" && <TournamentList />}
      </div>
    </div>
  );
};

export default Tournament;
