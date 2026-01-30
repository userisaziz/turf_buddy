import React, { useState } from "react";
import { User, Mail, MessageSquare } from "lucide-react";
import Button from "../components/common/Button";
import axiosInstance from "../hooks/useAxiosInstance";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse({ type: "", text: "" });

    try {
      const res = await axiosInstance.post(
        "/api/user/contact/send-msg",
        form
      );
      setResponse({ type: "success", text: res.data.message });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setResponse({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-2 bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border">
        <div className="card-body gap-4">
          <h2 className="text-2xl font-bold text-center">Contact Us</h2>
          <p className="text-sm text-center text-base-content/70">
            We’d love to hear from you.
          </p>

          {response.text && (
            <div className={`alert alert-${response.type}`}>
              <span>{response.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <label className="form-control">
              <span className="label-text mb-1">Name</span>
              <div className="input input-bordered flex items-center gap-2">
                <User size={18} className="opacity-60" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="grow"
                />
              </div>
            </label>

            {/* Email */}
            <label className="form-control">
              <span className="label-text mb-1">Email</span>
              <div className="input input-bordered flex items-center gap-2">
                <Mail size={18} className="opacity-60" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="grow"
                />
              </div>
            </label>

            {/* Message */}
            <label className="form-control">
              <span className="label-text mb-1">Message</span>
              <div className="textarea textarea-bordered flex gap-2">
                <MessageSquare size={18} className="opacity-60 mt-1" />
                <textarea
                  name="message"
                  placeholder="Type your message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="grow resize-none"
                  rows={4}
                />
              </div>
            </label>

            <Button
              type="submit"
              className="w-full bg-primary text-white"
              loading={loading}
              disabled={loading}
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
