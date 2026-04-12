import React from 'react';
import {
    PhoneMissed,
    TrendingDown,
    Trophy,
    Users,
    Lock,
    Receipt,
    LineChart,
    ChevronRight,
    CheckCircle2,
    Clock
} from 'lucide-react';

const TurfSalesPage = () => {
    return (
        <div className="bg-slate-50 font-sans text-slate-900 pb-20">

            {/* 1. THE "BLEEDING CASH" SECTION */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                            The Cost of Inaction
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold mt-4 mb-6">
                            You are losing money every time <br className="hidden md:block" />
                            <span className="text-red-600">you put your phone down.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* The Pain Card */}
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl relative">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <PhoneMissed className="text-red-500" /> Current Manual Way
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-600 items-start">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Missed calls while riding or sleeping = ₹0 revenue.
                                </li>
                                <li className="flex gap-3 text-slate-600 items-start">
                                    <span className="text-red-500 font-bold">✕</span>
                                    "Is 6PM open?" – Checking registers takes 5 mins.
                                </li>
                                <li className="flex gap-3 text-slate-600 items-start">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Chasing players for advance payments via WhatsApp.
                                </li>
                            </ul>
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <div className="text-4xl font-black text-slate-400">₹52,000</div>
                                <div className="text-sm font-bold text-red-500 uppercase tracking-tight">Leaking from your pocket yearly</div>
                            </div>
                        </div>

                        {/* The Gain Card */}
                        <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                            <div className="absolute top-[-20px] right-[-20px] bg-emerald-500 w-32 h-32 rounded-full blur-3xl opacity-50"></div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <CheckCircle2 className="text-emerald-300" /> The Automated Way
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex gap-3 items-start text-emerald-50">
                                    <CheckCircle2 size={18} className="text-emerald-300 mt-1 shrink-0" />
                                    Customers book & pay while you sleep.
                                </li>
                                <li className="flex gap-3 items-start text-emerald-50">
                                    <CheckCircle2 size={18} className="text-emerald-300 mt-1 shrink-0" />
                                    Live slot availability link in your Instagram bio.
                                </li>
                                <li className="flex gap-3 items-start text-emerald-50">
                                    <CheckCircle2 size={18} className="text-emerald-300 mt-1 shrink-0" />
                                    Instant PDF receipts sent automatically.
                                </li>
                            </ul>
                            <div className="mt-8 pt-6 border-t border-emerald-500 relative z-10">
                                <div className="text-4xl font-black text-white">100%</div>
                                <div className="text-sm font-bold text-emerald-200 uppercase tracking-tight">Booking Capture Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. THE "FULL BUSINESS SUITE" */}
            <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Not just a booking link. <br />
                                <span className="text-emerald-400 italic">Your entire HQ.</span>
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Stop juggling five different apps. We’ve consolidated everything into one dashboard designed for turf owners, not tech geeks.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold">
                                        Owner
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                                    +82
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-2 text-right">Trusted by 80+ Turf Owners</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Coaching - Reframed as "New Revenue" */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition duration-300">
                            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Monetize Your Coaching</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Collect student inquiries even when the turf is empty. A dedicated lead-gen tool for your academies.
                            </p>
                        </div>

                        {/* Tournaments - Reframed as "Marketing" */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition duration-300">
                            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Fill Your Tournaments</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Promote upcoming leagues directly on your booking page. Convert regular players into tournament entries.
                            </p>
                        </div>

                        {/* Recursive Blocking - Reframed as "Control" */}
                        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition duration-300">
                            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Set It & Forget It</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Have a permanent Sunday 7 PM booking? Block it recursively for the whole year in 2 clicks.
                            </p>
                        </div>

                        {/* Finance - Big Spotlight */}
                        <div className="md:col-span-3 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 mt-6 group">
                            <div className="flex-1">
                                <div className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold mb-6">
                                    THE TRUTH IN NUMBERS
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Analytics that tell you <br /> exactly when to hike prices.
                                </h3>
                                <p className="text-emerald-50 text-lg mb-8 max-w-xl">
                                    Stop guessing. See your heatmaps for peak hours. If Saturday mornings are always full, our analytics prove it's time to increase your rates.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/10 p-4 rounded-xl border border-white/10">
                                        <div className="text-2xl font-bold text-white tracking-tight">Revenue IQ</div>
                                        <div className="text-emerald-200 text-sm">Monthly growth tracking</div>
                                    </div>
                                    <div className="bg-black/10 p-4 rounded-xl border border-white/10">
                                        <div className="text-2xl font-bold text-white tracking-tight">No Disputes</div>
                                        <div className="text-emerald-200 text-sm">Searchable transaction logs</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform group-hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="font-bold text-sm">Monthly Revenue</div>
                                    <LineChart className="text-emerald-400" />
                                </div>
                                <div className="space-y-4">
                                    {[70, 40, 90].map((h, i) => (
                                        <div key={i} className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${h}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default TurfSalesPage;