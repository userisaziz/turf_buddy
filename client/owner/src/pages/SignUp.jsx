import { Link } from "react-router-dom";
import { useState } from "react";
import useSignUpForm from "@hooks/useSignUpForm";
import { Button, FormField } from "@components/common";
import TermsAndPrivacyModal from "@components/common/TermsAndPrivacyModal";

const SignUp = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useSignUpForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-5 bg-gray-50">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl border">
        <div className="card-body p-6">
          <h2 className="card-title justify-center text-xl font-bold mb-3">Create Owner Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3 py-1">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className={`checkbox checkbox-primary checkbox-sm ${errors.termsAccepted ? "checkbox-error" : ""}`}
                />
                <span className="label-text text-sm">
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
                <span className="text-error text-xs ml-9">
                  {errors.termsAccepted.message}
                </span>
              )}
            </div>

            <div className="form-control pt-1">
              <Button
                type="submit"
                className="btn-primary w-full shadow-md btn-sm h-10"
                loading={loading}
              >
                Sign Up & Continue
              </Button>
            </div>
          </form>
          <div className="text-center mt-3">
            <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Already have an account?{" "}
              <span className="text-primary font-bold">Login</span>
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