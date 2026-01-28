import useLoginForm from "../../hooks/useLoginForm";
import FormField from "../../components/common/FormField";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { Helmet } from "react-helmet";
const Login = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useLoginForm();

  return (
    <div className="flex items-center justify-center  max-md:p-4 bg-base-200 p-4 ">
      <Helmet>
        <title>Login Klb TurfBuddy</title>
        <meta
          name="description"
          content="Discover and book the best turf fields in kalaburgi/gulbarga with Klb TurfBuddy."
        />
        <meta
          name="keywords"
          content="Klb TurfBuddy, sports, turf booking, soccer, football, cricket, sports venues, Kalaburgi TurfBuddy, Gulbarga TurfBuddy,Kalaburgi Turf Buddy, Gulbarga Turf Buddy "
        />
        <link rel="canonical" href="https://www.example.com/home" />
      </Helmet>
      <div className="card w-full border md:w-96  bg-base-100 shadow-xl  ">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
            <div className="form-control mt-6">
              <Button type="submit" className="bg-primary text-white" loading={loading}>
                Login
              </Button>
            </div>
          </form>
          <div className="mt-6 flex flex-col items-center gap-4">
            {/* Primary Action: Sign Up */}
            <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all"
              >
                Register
              </Link>
            </div>

            {/* Secondary Action: Forgot Password */}
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
