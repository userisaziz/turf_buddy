import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import axiosInstance from "../../hooks/useAxiosInstance";
import toast from "react-hot-toast";
import { FORGOT_PASSWORD } from "../../api/endpoint";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(FORGOT_PASSWORD, {
        email,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="card w-full md:w-96 bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title justify-center">Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <Button type="submit" className="btn-primary" loading={loading}>
                Send Reset Link
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="link link-hover">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
