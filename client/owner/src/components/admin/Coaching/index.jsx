import React, { useState, useEffect } from "react";
import CreateCoaching from "./CreateCoaching";
import CoachingList from "./CoachingList";
import CoachingEnquiries from "./CoachingEnquiries";

const Coaching = () => {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Coaching Management
            </h1>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-1">
                <div className="tabs tabs-boxed bg-gray-100 p-2 rounded-lg">
                    <button
                        className={`tab text-lg font-semibold ${activeTab === "create"
                                ? "tab-active bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            } px-6 py-2 rounded-md transition-colors`}
                        onClick={() => setActiveTab("create")}
                    >
                        Create Coaching
                    </button>
                    <button
                        className={`tab text-lg font-semibold ${activeTab === "all"
                                ? "tab-active bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            } px-6 py-2 rounded-md transition-colors`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Coaching
                    </button>
                    <button
                        className={`tab text-lg font-semibold ${activeTab === "enquiries"
                                ? "tab-active bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            } px-6 py-2 rounded-md transition-colors`}
                        onClick={() => setActiveTab("enquiries")}
                    >
                        Enquiries
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {activeTab === "create" && <CreateCoaching />}
                {activeTab === "all" && <CoachingList />}
                {activeTab === "enquiries" && <CoachingEnquiries />}
            </div>
        </div>
    );
};

export default Coaching;
