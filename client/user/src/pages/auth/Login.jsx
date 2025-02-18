import useLoginForm from "../../hooks/useLoginForm";
import FormField from "../../components/common/FormField";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { Helmet } from "react-helmet";
const Login = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useLoginForm();

  return (
    <div className="flex items-center justify-center  min-h-screen max-md:p-4 bg-base-200 p-4 ">
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
              <Button type="submit" className="btn-primary" loading={loading}>
                Login
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <Link to="/signup" className="link link-hover">
              <p className="link link-hover">Don’t have an account? Register</p>
            </Link>
            <p className="link link-hover">
              <Link to="/forgot-password" className="link link-hover">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
