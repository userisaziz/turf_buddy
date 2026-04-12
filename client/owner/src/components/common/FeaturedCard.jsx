import React from 'react';
import {
    CheckCircle2,
    ShieldCheck,
    Zap,
    X,
    PhoneMissed,
    AlertCircle,
    Calendar,
    CreditCard,
    TrendingUp,
    BarChart3,
    Clock,
    Users,
    Trophy,
    Rocket,
    ArrowRight,
    MousePointer2,
    Lock
} from 'lucide-react';

const FeaturedCard = () => {
    return (
        <div className="bg-white font-sans text-slate-900 overflow-x-hidden">

            {/* SLIDE 1: TITLE / HERO */}
            <section className="relative pt-24 pb-20 px-6 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold mb-8 border border-emerald-100 italic">
                        <Zap size={16} /> Go Live in 24 Hours
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
                        Stop Missing Calls.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Start Filling Slots.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The <span className="text-slate-900 font-bold italic underline decoration-emerald-400/50">Zero-Call Booking System™</span> for Turf Owners.
                        Let your business run while you sleep.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold py-5 px-10 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] transform transition hover:-translate-y-1 flex items-center gap-3 group">
                            Apply Now & Go Live <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Illustration Placeholder/Mockup */}
                    <div className="mt-20 relative max-w-4xl mx-auto">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-4 md:p-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                                <div className="space-y-2 flex-1 text-left">
                                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />)}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-4 text-left">
                                    <div className="h-4 bg-emerald-50 rounded w-full" />
                                    <div className="h-4 bg-slate-50 rounded w-full" />
                                    <div className="h-4 bg-slate-50 rounded w-3/4" />
                                    <div className="h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 italic">
                                        <Calendar className="opacity-20 mr-2" /> Auto-Filling Slots...
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-24 bg-emerald-500 p-4 rounded-2xl text-white">
                                        <div className="text-xs opacity-80 mb-2">Earnings Today</div>
                                        <div className="text-2xl font-bold">₹12,400</div>
                                    </div>
                                    <div className="h-24 bg-slate-900 p-4 rounded-2xl text-white">
                                        <div className="text-xs opacity-60 mb-2">Bookings</div>
                                        <div className="text-2xl font-bold">14</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 2: THE CORE PROBLEM (PAIN) */}
            <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                    <PhoneMissed size={400} />
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">The High Cost of Inaction</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
                            You're Losing Money Every Time <br />
                            <span className="text-emerald-400">You Put Your Phone Down.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <PhoneMissed className="text-red-400" />,
                                title: "Missed Calls",
                                text: "Every missed call is a missed booking. While you ride, sleep, or eat, revenue is leaking.",
                                sub: "₹0 Revenue during 'Off' hours"
                            },
                            {
                                icon: <AlertCircle className="text-orange-400" />,
                                title: "Double Bookings",
                                text: "Manual registers cause chaos. Double-booked slots lead to angry customers & bad reviews.",
                                sub: "Destroys Reputation"
                            },
                            {
                                icon: <Clock className="text-blue-400" />,
                                title: "Chasing Payments",
                                text: "Spending hours on WhatsApp chasing 'advances'. People don't show up, you lose out.",
                                sub: "Wasted Time & Energy"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-emerald-500/50 transition-colors group">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">{item.text}</p>
                                <div className="text-xs font-black uppercase tracking-widest text-emerald-400/60 bg-emerald-400/5 inline-block px-3 py-1 rounded-lg">
                                    {item.sub}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 p-8 rounded-[2rem] text-center">
                        <div className="text-5xl font-black text-white mb-2 tracking-tighter">₹52,000+</div>
                        <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Estimated loss yearly due to manual bookings</p>
                    </div>
                </div>
            </section>

            {/* SLIDE 3: OLD WAY VS NEW WAY */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900">Manual Chaos vs Automated Growth</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Old Way */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <X size={100} className="text-red-500" />
                            </div>
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold mb-8 uppercase tracking-widest">
                                <X size={14} /> The Old Way
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Manually answering 20+ calls daily",
                                    "Checking registers for slot availability",
                                    "Chasing players on WhatsApp for payments",
                                    "Frequent disputes over double-bookings",
                                    "No data on who your best customers are"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-slate-500 font-medium italic">
                                        <X size={18} className="text-red-300 shrink-0 mt-1" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* New Way */}
                        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CheckCircle2 size={100} className="text-emerald-500" />
                            </div>
                            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-8 uppercase tracking-widest shadow-lg shadow-emerald-200">
                                <CheckCircle2 size={14} /> The AutoBooked Way
                            </div>
                            <ul className="space-y-6 relative z-10">
                                {[
                                    "Online booking 24/7 (Even at 3 AM)",
                                    "Live slot availability updated instantly",
                                    "Automatic advance or full payments",
                                    "Instant SMS & WhatsApp confirmations",
                                    "Full analytics on revenue & peak hours"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-slate-800 font-bold">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 4 & 5: THE SOLUTION & BENEFITS */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-sm font-bold border border-emerald-100 italic">
                                The Outcome You Want
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                The <span className="text-emerald-500 italic">Zero-Call</span> <br />
                                Booking System™
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We automate your entire booking & payment flow from start to finish.
                                Your customers find the link, see the slots, and pay.
                                You get a notification. That's it.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {[
                                    { icon: <TrendingUp className="text-emerald-500" />, title: "More Bookings", text: "Capture demand 24/7" },
                                    { icon: <ShieldCheck className="text-emerald-500" />, title: "Zero Chasing", text: "Payments upfront" },
                                    { icon: <AlertCircle className="text-emerald-500" />, title: "No Mistakes", text: "Zero double-bookings" },
                                    { icon: <Users className="text-emerald-500" />, title: "Loyal Players", text: "Better experience" }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-xs text-slate-500 leading-tight">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                            <div className="relative bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-8 border-slate-800">
                                <div className="bg-slate-800 rounded-[2.5rem] aspect-[4/5] overflow-hidden flex flex-col items-center justify-center text-center p-8 space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                                        <CheckCircle2 size={40} className="text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white italic">Payment Success</h3>
                                        <p className="text-emerald-400 font-bold">₹1,500.00 Received from Client</p>
                                    </div>
                                    <div className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-3">
                                        <div className="h-2 bg-slate-700 rounded w-full" />
                                        <div className="h-2 bg-slate-700 rounded w-3/4 mx-auto" />
                                    </div>
                                    <p className="text-white/40 text-[10px] tracking-widest uppercase">Instant Confirmation Sent</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 6 & 7: FEATURES & ANALYTICS */}
            <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Know Exactly When to <span className="text-emerald-400 underline decoration-emerald-400/30">Increase Prices.</span></h2>
                            <p className="text-slate-400 text-lg">Stop guessing. Use real revenue intelligence to optimize your facility.</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                            <div className="text-3xl font-black mb-1">94%</div>
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Efficiency Boost</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <BarChart3 />, title: "Peak-Hour Heatmaps", text: "See which hours are high-demand and adjust prices instantly." },
                            { icon: <CreditCard />, title: "Token Payments", text: "Secure advance payments & reduce cancellations by 80%." },
                            { icon: <Users />, title: "Customer Database", text: "Know your regulars and offer them rewards to keep them coming." },
                            { icon: <Lock />, title: "Full Admin Control", text: "Manage multi-courts & team access from one single app." }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 space-y-4 hover:bg-slate-800 transition-colors group">
                                <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Simple Chart Illustration */}
                    <div className="mt-12 bg-slate-800/30 border border-slate-800 rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h4 className="text-xl font-bold">Revenue Growth</h4>
                                <p className="text-slate-500 text-sm">Last 30 Days (Automated Mode)</p>
                            </div>
                            <div className="text-emerald-400 font-black">+42.8%</div>
                        </div>
                        <div className="h-48 flex items-end gap-2 md:gap-4">
                            {[40, 60, 45, 70, 90, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-xl group relative">
                                    <div className="absolute inset-x-0 bottom-0 bg-emerald-500 rounded-t-xl transition-all duration-1000 group-hover:bg-emerald-400" style={{ height: `${h}%` }} />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 8: SPEED & SETUP */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Speed to Market</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">Live in 24 Hours. <br /> Done-For-You.</h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100" />

                        <div className="space-y-16">
                            {[
                                { title: "Apply Online", text: "Fill our simple 2-minute application form.", icon: <MousePointer2 /> },
                                { title: "Custom Setup", text: "We configure your slots, fields & payments within 12 hours.", icon: <Rocket /> },
                                { title: "Go Live", text: "Start accepting online bookings. We manage maintenance for life.", icon: <Zap /> }
                            ].map((step, i) => (
                                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 text-center md:text-left space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900">{step.title}</h3>
                                        <p className="text-slate-500">{step.text}</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center relative z-10 border-4 border-slate-50 shadow-xl">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 9: PRICING */}
            {/* SLIDE 9: PRICING - Removed as per user request */}
            {/* <PricingSection /> */}

            {/* SLIDE 10: TRUST & SOCIAL PROOF */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-slate-900 leading-tight">Trusted by 80+ <br /> Turf Owners</h2>
                            <p className="text-lg text-slate-600">Join a network of elite facility owners who have already digitized their business.</p>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">O</div>
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">+75</div>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Trophy size={80} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <p className="text-xl font-medium italic leading-relaxed">
                                    "I used to spend 4 hours a day on calls. Now, I just get WhatsApp notifications that my slots are booked. My revenue is up by 30%."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500" />
                                    <div>
                                        <div className="font-bold">Rahul M.</div>
                                        <div className="text-xs text-slate-400">Arena Pros Turf, Mumbai</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLIDE 11 & 12: CTA & FOOTER */}
            <section className="py-24 px-6 bg-emerald-500 text-white text-center rounded-t-[4rem]">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight">Let Your Turf <br className="hidden md:block" /> Book Itself.</h2>
                    <p className="text-xl md:text-2xl text-emerald-50 font-medium">Apply Now & Go Live in 24 Hours. No calls. No chasing. No stress.</p>
                    <button className="bg-slate-900 hover:bg-black text-white text-xl font-bold py-6 px-12 rounded-[2rem] shadow-2xl transform transition hover:-translate-y-2 flex items-center gap-4 mx-auto group">
                        Start My Automation <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center justify-center gap-8 opacity-60">
                        <div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={18} /> Secure Setup</div>
                        <div className="flex items-center gap-2 text-sm font-bold"><Zap size={18} /> Instant Onboarding</div>
                    </div>
                </div>
            </section>

        </div>
    );
};

// export const PricingSection = () => { ... }

export default FeaturedCard;