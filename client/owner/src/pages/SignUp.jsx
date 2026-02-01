import { Link } from "react-router-dom";
import { useState } from "react";
import useSignUpForm from "@hooks/useSignUpForm";
import { Button, FormField } from "@components/common";
import TermsAndPrivacyModal from "@components/common/TermsAndPrivacyModal";

const SignUp = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useSignUpForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl border">
        <div className="card-body max-md:p-4">
          <h2 className="card-title justify-center text-3xl font-bold mb-8">Create Owner Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="lg:grid grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                register={register}
                error={errors.name}
              />
              <FormField
                label="Contact Number"
                name="phone"
                type="text"
                register={register}
                error={errors.phone}
              />
            </div>
            <FormField
              label="Professional Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <div className="lg:grid grid-cols-2 gap-6">
              <FormField
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                register={register}
                error={errors.confirmPassword}
              />
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className={`checkbox checkbox-primary ${errors.termsAccepted ? 'checkbox-error' : ''}`}
                />
                <span className="label-text">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    Turf Owner Terms & Privacy Policy
                  </button>
                </span>
              </label>
              {errors.termsAccepted && (
                <span className="text-error text-xs mt-1 ml-10">
                  {errors.termsAccepted.message}
                </span>
              )}
            </div>

            <div className="form-control mt-10">
              <Button
                type="submit"
                className="btn-primary w-full shadow-lg"
                loading={loading}
              >
                Sign Up & Continue
              </Button>
            </div>
          </form>
          <div className="text-center mt-8">
            <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Already have an account? <span className="text-primary font-bold">Login</span>
            </Link>
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

export default SignUp;
