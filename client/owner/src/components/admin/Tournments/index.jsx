import React, { useState } from "react";
import CreateTournament from "./CreateTournment";
import TournamentList from "./TournamentList"; // Adjust the import path as necessary

const Tournament = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Tournament Management
      </h1>
      <div className="tabs">
        <a
          className={`tab tab-bordered ${
            activeTab === "create" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create Tournament
        </a>
        <a
          className={`tab tab-bordered ${
            activeTab === "all" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Tournaments
        </a>
      </div>

      <div className="mt-4">
        {activeTab === "create" && <CreateTournament />}
        {activeTab === "all" && <TournamentList />}
      </div>
    </div>
  );
};

export default Tournament;
