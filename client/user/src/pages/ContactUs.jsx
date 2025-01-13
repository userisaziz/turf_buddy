import React, { useState } from "react";
import Button from "../components/common/Button";
import axiosInstance from "../hooks/useAxiosInstance";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/user/contact/send-msg", {
        name,
        email,
        message,
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="card w-full md:w-96 bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title justify-center">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">Message</label>
              <textarea
                className="textarea textarea-bordered"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <Button type="submit" className="btn-primary" loading={loading}>
                Send Message
              </Button>
            </div>
          </form>
          {responseMessage && (
            <p className="text-center mt-4">{responseMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
