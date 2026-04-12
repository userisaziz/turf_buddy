import { useState, useRef } from "react";
import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useBecomeOwner from "../../hooks/useBecomeOwner";
import TermsAndPrivacyModal from "../../components/common/TermsAndPrivacyModal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PATHS } from "../../constants/constants";
import HormoziLanding from "./SalesSection";
import { ChevronDown, ShieldCheck, Zap, BarChart3, Rocket } from "lucide-react";

const BecomeOwner = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { register, handleSubmit, errors, onSubmit, loading } = useBecomeOwner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 transition-colors duration-300">
        <div className="max-w-md w-full p-10 bg-base-100 rounded-[2.5rem] shadow-2xl border border-base-300 text-center">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 mx-auto animate-pulse">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-black mb-4 text-base-content">Access Restricted</h1>
          <p className="text-base-content/70 mb-8 text-lg">
            You must be logged in to apply as a turf owner.
          </p>
          <div className="flex flex-col gap-4">
            <Link to={`/${PATHS.SIGNUP}`} className="btn btn-primary btn-lg rounded-2xl shadow-lg hover:shadow-primary/20">
              Create My Account
            </Link>
            <Link to={`/${PATHS.LOGIN}`} className="btn btn-ghost text-base-content/60">
              Already a member? Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen transition-colors duration-300">
      {/* HERO / FORM SECTION */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-14 items-start">

          {/* LEFT: VALUE + TRUST STACK */}
          <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-base-content">
                Scale Your <span className="text-primary">Turf Empire.</span>
              </h1>
              <p className="text-lg text-base-content/70">
                Stop chasing payments. Start scaling bookings.
              </p>
            </div>

            {/* VALUE CARDS */}
            <div className="grid gap-4">
              {[
                { icon: <Zap />, title: "Go Live in 24 Hours", text: "We handle setup & onboarding.", color: "primary" },
                { icon: <BarChart3 />, title: "More Bookings", text: "Automation reduces cancellations.", color: "secondary" },
                { icon: <ShieldCheck />, title: "Zero Risk", text: "No listing fee. Cancel anytime.", color: "accent" }
              ].map((item, i) => (
                <div key={i} className="group bg-base-200/50 border border-base-300 rounded-3xl p-6 transition-all hover:bg-base-100 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}/10 text-${item.color} flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-base-content">{item.title}</h3>
                  </div>
                  <p className="text-sm text-base-content/60 ml-14">{item.text}</p>
                </div>
              ))}
            </div>

            {/* PRICE ANCHOR - HIGH CONTRAST */}
            <div className="p-8 bg-neutral text-neutral-content rounded-3xl shadow-2xl relative overflow-hidden">
              <BarChart3 className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10" />
              <h3 className="text-4xl font-black mb-2 italic">₹0 <span className="text-sm font-normal not-italic uppercase opacity-70">Listing Fee</span></h3>
              <p className="text-neutral-content/80 mb-4">
                We only win when you win. Period.
              </p>
              <div className="badge badge-primary font-bold">
                Owner Protection Enabled
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 border border-base-300 shadow-2xl overflow-visible rounded-[2.5rem]">
              <div className="absolute -top-4 right-8 z-10">
                <div className="badge badge-secondary badge-lg py-5 px-6 font-black italic shadow-lg animate-bounce">
                  Limited Slots Left
                </div>
              </div>

              <div className="card-body p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Rocket size={24} />
                  </div>
                  <h2 className="card-title text-3xl font-black text-base-content">Business Application</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField label="Full Name" name="name" register={register} error={errors.name} className="input-bordered focus:input-primary" />
                    <FormField label="Contact Number" name="phone" register={register} error={errors.phone} className="input-bordered" />
                  </div>

                  <FormField label="Business Email" name="email" type="email" register={register} error={errors.email} className="input-bordered" />

                  <div className="form-control bg-base-200/50 p-6 rounded-2xl border border-base-300 group transition-all hover:border-primary/30">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        {...register("termsAccepted")}
                        className={`checkbox checkbox-primary rounded-lg transition-transform active:scale-95 ${errors.termsAccepted ? "checkbox-error" : ""}`}
                      />
                      <span className="label-text text-base-content/80 font-medium">
                        I agree to the{" "}
                        <button type="button" onClick={() => setIsModalOpen(true)} className="text-primary font-bold hover:underline">
                          Owner Terms & Service
                        </button>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <span className="text-error text-xs mt-3 ml-10 animate-fade-in">
                        {errors.termsAccepted.message}
                      </span>
                    )}
                  </div>

                  <Button
                    className="btn btn-primary btn-lg w-full rounded-2xl text-xl font-black shadow-xl hover:shadow-primary/40 group"
                    loading={loading}
                  >
                    Launch My Turf
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-40 grayscale">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black">256-bit Secure Encrypted Application</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SALES SECTION */}
      <HormoziLanding onCtaClick={scrollToForm} />

      {/* SCROLL BACK UP INDICATOR */}
      <div className="flex justify-center pb-12 -mt-8 relative z-20">
        <button
          onClick={scrollToForm}
          className="btn btn-circle btn-secondary btn-lg shadow-2xl animate-bounce hover:scale-110 transition-transform"
        >
          <ChevronDown size={32} />
        </button>
      </div>

      <div ref={formRef} className="h-1" />

      <TermsAndPrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BecomeOwner;