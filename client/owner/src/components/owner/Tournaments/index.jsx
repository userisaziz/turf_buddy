import React, { useState } from "react";
import CreateTournament from "./CreateTournament";
import TournamentList from "./TournamentList";
import { Plus, List } from "lucide-react";

const Tournament = () => {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tournament Management</h1>
                    <p className="text-gray-500">Create and manage sports tournaments at your turfs</p>
                </div>

                <div className="bg-base-200 p-1.5 rounded-xl inline-flex gap-1 border border-base-300">
                    <button
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "all"
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "hover:bg-base-300 text-base-content/70"
                            }`}
                        onClick={() => setActiveTab("all")}
                    >
                        <List className="w-4 h-4" /> My Tournaments
                    </button>
                    <button
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "create"
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "hover:bg-base-300 text-base-content/70"
                            }`}
                        onClick={() => setActiveTab("create")}
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "create" ? (
                    <CreateTournament onSuccess={() => setActiveTab("all")} />
                ) : (
                    <TournamentList />
                )}
            </div>
        </div>
    );
};

export default Tournament;
