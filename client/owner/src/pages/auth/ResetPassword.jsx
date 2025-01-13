import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import axiosInstance from "../../hooks/useAxiosInstance";
import toast from "react-hot-toast";
import { RESET_PASSWORD } from "../../api/endpoint";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(RESET_PASSWORD, {
        token,
        newPassword,
      });
      toast.success(response.data.message);

      if (response.status === 200) {
        navigate("/login");
      }
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
          <h2 className="card-title justify-center">Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            <div className="form-control">
              <label className="label">New Password</label>
              <input
                type="password"
                className="input input-bordered"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <Button type="submit" className="btn-primary" loading={loading}>
                Reset Password
              </Button>
            </div>
          </form>
          {message && <p className="text-center mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
