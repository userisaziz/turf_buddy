import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const TermsAndPrivacyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-gray-800">
            <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col relative animate-zoom-in">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 rounded-t-2xl z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Privacy Policy & Terms</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">TurfBuddy – Privacy Policy & Terms & Conditions</h3>
                        <p className="text-sm italic mb-4">Last updated: 31 January 2026</p>
                        <p>This document governs the use of the **TurfBuddy** mobile application and related services ("Platform"), operated by **TurfBuddy** ("we", "us", "our"). It applies to both **Users (Players/Customers)** and **Owners (Turf/Facility Owners)**.</p>
                    </section>

                    <div className="divider my-0"></div>

                    <section>
                        <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wider">PART A – PRIVACY POLICY</h3>

                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">1. Information We Collect</h4>
                                <div className="pl-4 space-y-2">
                                    <p><span className="font-semibold">1.1 User Information:</span> Name, phone number, email address, Location, Booking details, Device information.</p>
                                    <p><span className="font-semibold">1.2 Owner Information:</span> Owner name, phone number, email, Turf/facility details, Bank or payment settlement details, Booking and earnings history.</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">2. How We Use Your Information</h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>To process bookings and payments.</li>
                                    <li>To show nearby turfs using maps.</li>
                                    <li>To send booking confirmations and notifications.</li>
                                    <li>To prevent fraud and comply with laws.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="divider my-0"></div>

                    <section>
                        <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wider">PART B – TERMS & CONDITIONS</h3>

                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Section II – TERMS FOR OWNERS</h4>
                                <div className="pl-4 space-y-2">
                                    <p><span className="font-semibold">14. Owner Responsibilities:</span> Provide accurate turf details, honor confirmed bookings, and maintain safe facilities.</p>
                                    <p><span className="font-semibold">15. Pricing & Commission:</span> Owners set pricing; TurfBuddy may charge a commission per booking.</p>
                                    <p><span className="font-semibold">16. Payments & Settlements:</span> Earnings are settled as per the agreed payout cycle.</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">19. Limitation of Liability</h4>
                                <p>TurfBuddy is not liable for injuries, accidents, or losses at turf locations, or disputes between users and owners.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gray-50 p-4 rounded-xl text-center italic text-gray-600">
                        "By using TurfBuddy, you acknowledge that you have read, understood, and agreed to this Privacy Policy and Terms & Conditions."
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 sticky bottom-0 rounded-b-2xl flex justify-center">
                    <button onClick={onClose} className="btn btn-primary px-8 bg-blue-600 text-white border-none hover:bg-blue-700">I Understand</button>
                </div>
            </div>
        </div>
    );
};

TermsAndPrivacyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TermsAndPrivacyModal;
