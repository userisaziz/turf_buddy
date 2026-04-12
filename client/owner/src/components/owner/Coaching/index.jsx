import React, { useState } from "react";
import CreateCoaching from "./CreateCoaching";
import CoachingList from "./CoachingList";
import CoachingEnquiries from "./CoachingEnquiries";

const Coaching = () => {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-base-300">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Coaching Management</h1>
                        <p className="text-base-content/60 mt-1">Manage classes, schedules, and enquiries.</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-col w-full">
                    <div className="tabs tabs-lifted z-10 -mb-[1px]">
                        <button
                            className={`tab tab-lg ${activeTab === "create" ? "tab-active [--tab-bg:white] font-bold text-primary" : ""}`}
                            onClick={() => setActiveTab("create")}
                        >
                            Create Class
                        </button>
                        <button
                            className={`tab tab-lg ${activeTab === "all" ? "tab-active [--tab-bg:white] font-bold text-primary" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Classes
                        </button>
                        <button
                            className={`tab tab-lg ${activeTab === "enquiries" ? "tab-active [--tab-bg:white] font-bold text-primary" : ""}`}
                            onClick={() => setActiveTab("enquiries")}
                        >
                            Enquiries
                        </button>
                        <div className="tab tab-lg flex-1 cursor-default pointer-events-none"></div>
                    </div>

                    {/* Tab Content Area - White background connects to the active tab */}
                    <div className="bg-white p-6 rounded-b-box rounded-tr-box border-base-300 shadow-sm min-h-[500px]">
                        {activeTab === "create" && <CreateCoaching />}
                        {activeTab === "all" && <CoachingList />}
                        {activeTab === "enquiries" && <CoachingEnquiries />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coaching;