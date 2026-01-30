import { Link } from "react-router-dom";
import { useState } from "react";
import FormField from "../../components/common/FormField";
import useSignUpForm from "../../hooks/useSignUpForm";
import Button from "../../components/common/Button";
import TermsAndPrivacyModal from "../../components/common/TermsAndPrivacyModal";

const SignUp = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useSignUpForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="card w-full md:w-96 bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <FormField
              label="Name"
              name="name"
              type="text"
              register={register}
              error={errors.name}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              register={register}
              error={errors.phone}
            />
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

            {/* Terms and Conditions Checkbox */}
            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className={`checkbox checkbox-primary checkbox-sm ${errors.termsAccepted ? 'checkbox-error' : ''}`}
                />
                <span className="label-text text-xs">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    Terms & Privacy Policy
                  </button>
                </span>
              </label>
              {errors.termsAccepted && (
                <span className="text-error text-[10px] mt-1 ml-9">
                  {errors.termsAccepted.message}
                </span>
              )}
            </div>

            <div className="form-control mt-6">
              <Button type="submit" className="bg-primary text-white" loading={loading}>
                Create Account
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm link link-hover text-base-content/60">
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
