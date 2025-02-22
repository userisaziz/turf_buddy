import useLoginForm from "@hooks/useLoginForm";
import { Link } from "react-router-dom";

import { Button, FormField } from "@components/common";

const Login = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useLoginForm();

  return (
    <div className="flex items-center justify-center  min-h-screen max-md:p-4 bg-base-200 p-4 ">
      <div className="card w-full border  lg:w-96 bg-base-100 shadow-xl ">
        <div className="card-body ">
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
