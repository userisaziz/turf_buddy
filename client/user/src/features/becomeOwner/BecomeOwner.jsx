import { useState } from "react";
import FormField from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useBecomeOwner from "../../hooks/useBecomeOwner";
import TermsAndPrivacyModal from "../../components/common/TermsAndPrivacyModal";

const BecomeOwner = () => {
  const { register, handleSubmit, errors, onSubmit, loading } =
    useBecomeOwner();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto mt-20 p-4">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Become a Turf Owner
      </h1>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-base-100 p-8 rounded-2xl shadow-xl border border-base-200">
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="FullName"
              name="name"
              type="text"
              register={register}
              error={errors.name}
            />
            <FormField
              label="Business Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <FormField
              label="Contact Number"
              name="phone"
              type="text"
              register={register}
              error={errors.phone}
            />

            {/* Terms and Conditions Checkbox */}
            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className={`checkbox checkbox-secondary checkbox-sm ${errors.termsAccepted ? 'checkbox-error' : ''}`}
                />
                <span className="label-text text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-secondary font-bold hover:underline"
                  >
                    Owner Terms & Service
                  </button>
                </span>
              </label>
              {errors.termsAccepted && (
                <span className="text-error text-[10px] mt-1 ml-9">
                  {errors.termsAccepted.message}
                </span>
              )}
            </div>

            <Button className="btn btn-primary w-full mt-8 shadow-lg shadow-primary/20" loading={loading}>
              Submit Application
            </Button>
          </form>
        </div>

        {/* content section */}
        <div className="h-full">
          <div className="bg-gradient-to-br from-base-200 to-base-100 p-8 rounded-2xl shadow-inner border border-base-200 h-full">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-secondary">#</span> Getting Started
            </h2>
            <p className="text-base-content/70 mb-8 leading-relaxed">
              Join our platform as a turf owner and digitize your sports
              facility management. Reach thousands of local players instantly.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-bold mb-1">Apply Online</h3>
                  <p className="text-sm text-base-content/60">Fill out our simple application form with your facilities basic info.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-bold mb-1">Admin Verification</h3>
                  <p className="text-sm text-base-content/60">Our team will verify your details and facility legitimacy within 48 hours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-bold mb-1">Launch Business</h3>
                  <p className="text-sm text-base-content/60">Receive your account credentials and start accepting real-time bookings.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-base-100 rounded-xl border border-dashed border-base-300">
              <h3 className="text-lg font-bold mb-3">Owner Benefits:</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-base-content/70">
                <li className="flex items-center gap-2">✓ Dynamic Pricing</li>
                <li className="flex items-center gap-2">✓ Advanced Analytics</li>
                <li className="flex items-center gap-2">✓ Slot Management</li>
                <li className="flex items-center gap-2">✓ Automated Payouts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <TermsAndPrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BecomeOwner;
