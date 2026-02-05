import React, { useState, useEffect } from "react";
import axiosInstance from "../../../hooks/useAxiosInstance";
import useTurfManagement from "@hooks/owner/useTurfManagement";
import SportsTypeSelector from "../../common/SportsTypeSelector";
import { User, Phone, Mail, Clock, Calendar, DollarSign, Users, CheckCircle, MapPin, Briefcase } from "lucide-react"; // Ideally use Lucide React, or replace with SVG below

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CreateCoaching = () => {
    // ... [Keep your existing state and handler logic exactly as it is] ...
    const [coachingData, setCoachingData] = useState({
        name: "", description: "", coachName: "", coachPhone: "", coachEmail: "",
        sportsType: "", startTime: "", endTime: "", daysOfWeek: [], startDate: "",
        termDuration: 6, monthlyFee: "", registrationFee: "", maxStudents: "",
        ageGroup: { minAge: "", maxAge: "" }, includes: [], turf: ""
    });
    const [includeInput, setIncludeInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { turfs, isLoading: turfLoading, fetchTurfs, error: turfError } = useTurfManagement();

    useEffect(() => { 
      fetchTurfs();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("ageGroup.")) {
            const ageKey = name.split(".")[1];
            setCoachingData((prev) => ({ ...prev, ageGroup: { ...prev.ageGroup, [ageKey]: value } }));
        } else {
            setCoachingData({ ...coachingData, [name]: value });
        }
    };

    const handleDayToggle = (day) => {
        setCoachingData((prev) => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const handleAddInclude = () => {
        if (includeInput.trim()) {
            setCoachingData((prev) => ({ ...prev, includes: [...prev.includes, includeInput.trim()] }));
            setIncludeInput("");
        }
    };

    const handleRemoveInclude = (index) => {
        setCoachingData((prev) => ({ ...prev, includes: prev.includes.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (coachingData.daysOfWeek.length === 0) {
            alert("Please select at least one day of the week");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.post("/api/owner/coaching/create", coachingData);
            alert("Coaching class created successfully!");
            setCoachingData({
                name: "", description: "", coachName: "", coachPhone: "", coachEmail: "",
                sportsType: "", startTime: "", endTime: "", daysOfWeek: [], startDate: "",
                termDuration: 6, monthlyFee: "", registrationFee: "", maxStudents: "",
                ageGroup: { minAge: "", maxAge: "" }, includes: [], turf: ""
            });
        } catch (error) {
            alert("Error creating coaching: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Helper Component for Icons to keep JSX clean
    const IconWrapper = ({ children }) => <span className="text-gray-400 mr-2">{children}</span>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Main Info & Coach */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Card 1: Class Details */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg text-primary mb-4 flex items-center gap-2">
                                <Briefcase size={20} /> Class Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control md:col-span-2">
                                    <label className="label"><span className="label-text font-medium">Coaching Name</span></label>
                                    <input type="text" name="name" placeholder="e.g. Elite Football Academy" className="input input-bordered w-full" value={coachingData.name} onChange={handleChange} required />
                                </div>
                                
                                <div className="form-control md:col-span-2">
                                    <label className="label"><span className="label-text font-medium">Description</span></label>
                                    <textarea name="description" className="textarea textarea-bordered h-24" placeholder="What will students learn?" value={coachingData.description} onChange={handleChange} required></textarea>
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text font-medium">Sport Type</span></label>
                                    <SportsTypeSelector value={coachingData.sportsType} onChange={(val) => setCoachingData({ ...coachingData, sportsType: val })} />
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text font-medium">Location (Turf)</span></label>
                                    <div className="join w-full">
                                        <div className="btn btn-square join-item no-animation bg-base-200 border-base-300"><MapPin size={18} /></div>
                                        <select name="turf" value={coachingData.turf} onChange={handleChange} className="select select-bordered join-item w-full" required>
                                            <option value="">Select Turf Facility</option>
                                            {turfLoading && <option>Loading turfs...</option>}
                                            {!turfLoading && turfError && <option value="">Error loading turfs</option>}
                                            {!turfLoading && !turfError && turfs && turfs.length === 0 && <option value="">No turfs available</option>}
                                            {!turfLoading && !turfError && turfs?.map((turf) => (
                                                <option key={turf._id} value={turf._id}>{turf.name} - {turf.city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Coach Information */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg text-primary mb-4 flex items-center gap-2">
                                <User size={20} /> Coach Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Full Name</span></label>
                                    <label className="input input-bordered flex items-center gap-2">
                                        <User size={16} className="opacity-70" />
                                        <input type="text" name="coachName" className="grow" placeholder="Coach Name" value={coachingData.coachName} onChange={handleChange} required />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Phone Number</span></label>
                                    <label className="input input-bordered flex items-center gap-2">
                                        <Phone size={16} className="opacity-70" />
                                        <input type="text" name="coachPhone" className="grow" placeholder="+91 98765..." value={coachingData.coachPhone} onChange={handleChange} required />
                                    </label>
                                </div>
                                <div className="form-control md:col-span-2">
                                    <label className="label"><span className="label-text">Email Address (Optional)</span></label>
                                    <label className="input input-bordered flex items-center gap-2">
                                        <Mail size={16} className="opacity-70" />
                                        <input type="email" name="coachEmail" className="grow" placeholder="coach@example.com" value={coachingData.coachEmail} onChange={handleChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Included Items */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg text-primary mb-2 flex items-center gap-2">
                                <CheckCircle size={20} /> What's Included?
                            </h3>
                            <div className="join w-full mb-4">
                                <input 
                                    type="text" 
                                    className="input input-bordered join-item w-full" 
                                    placeholder="e.g. Jersey, Equipment, Certificate" 
                                    value={includeInput} 
                                    onChange={(e) => setIncludeInput(e.target.value)} 
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())} 
                                />
                                <button type="button" onClick={handleAddInclude} className="btn btn-primary join-item">Add Item</button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {coachingData.includes.length === 0 && <span className="text-gray-400 text-sm italic py-2">No items added yet.</span>}
                                {coachingData.includes.map((item, index) => (
                                    <div key={index} className="badge badge-lg badge-ghost gap-2 p-3">
                                        {item}
                                        <button type="button" onClick={() => handleRemoveInclude(index)} className="btn btn-xs btn-circle btn-ghost">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Schedule & Pricing */}
                <div className="space-y-6">
                    
                    {/* Card 4: Schedule */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg text-primary mb-4 flex items-center gap-2">
                                <Calendar size={20} /> Schedule
                            </h3>
                            
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text font-medium">Days of Week</span></label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDayToggle(day)}
                                            className={`btn btn-sm ${coachingData.daysOfWeek.includes(day) ? "btn-primary" : "btn-outline border-base-300 text-base-content/70 hover:bg-base-200 hover:text-base-content"}`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-xs uppercase font-bold text-gray-500">Starts</span></label>
                                    <input type="time" name="startTime" value={coachingData.startTime} onChange={handleChange} className="input input-bordered input-sm w-full" required />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-xs uppercase font-bold text-gray-500">Ends</span></label>
                                    <input type="time" name="endTime" value={coachingData.endTime} onChange={handleChange} className="input input-bordered input-sm w-full" required />
                                </div>
                            </div>

                            <div className="divider my-0"></div>

                            <div className="form-control mt-4">
                                <label className="label"><span className="label-text">Start Date</span></label>
                                <input type="date" name="startDate" value={coachingData.startDate} onChange={handleChange} className="input input-bordered w-full" required />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label"><span className="label-text">Duration</span></label>
                                <select name="termDuration" value={coachingData.termDuration} onChange={handleChange} className="select select-bordered w-full" required>
                                    <option value={3}>3 Months</option>
                                    <option value={6}>6 Months</option>
                                    <option value={12}>1 Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Pricing & Requirements */}
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg text-primary mb-4 flex items-center gap-2">
                                <DollarSign size={20} /> Pricing & Limits
                            </h3>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Monthly Fee</span></label>
                                <label className="input input-bordered flex items-center gap-2">
                                    ₹ <input type="number" name="monthlyFee" placeholder="0.00" value={coachingData.monthlyFee} onChange={handleChange} className="grow" required />
                                </label>
                            </div>

                            <div className="form-control mt-2">
                                <label className="label"><span className="label-text">Registration Fee</span></label>
                                <label className="input input-bordered flex items-center gap-2">
                                    ₹ <input type="number" name="registrationFee" placeholder="0.00" value={coachingData.registrationFee} onChange={handleChange} className="grow" />
                                </label>
                            </div>

                            <div className="divider"></div>

                            <div className="form-control">
                                <label className="label"><span className="label-text flex items-center gap-2"><Users size={16}/> Max Students</span></label>
                                <input type="number" name="maxStudents" className="input input-bordered" placeholder="e.g. 20" value={coachingData.maxStudents} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-xs">Min Age</span></label>
                                    <input type="number" name="ageGroup.minAge" placeholder="Min" value={coachingData.ageGroup.minAge} onChange={handleChange} className="input input-bordered input-sm" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-xs">Max Age</span></label>
                                    <input type="number" name="ageGroup.maxAge" placeholder="Max" value={coachingData.ageGroup.maxAge} onChange={handleChange} className="input input-bordered input-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer for Mobile, Standard for Desktop */}
            <div className="flex justify-end pt-4 border-t border-base-300">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-primary btn-lg w-full md:w-auto px-12 shadow-lg"
                >
                    {loading ? <span className="loading loading-spinner"></span> : "Create Coaching Class"}
                </button>
            </div>
        </form>
    );
};

export default CreateCoaching;