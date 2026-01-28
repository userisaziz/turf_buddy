import toast from "react-hot-toast";
import axiosInstance from "../hooks/useAxiosInstance";
import { CREATE_ORDER } from "../api/endpoint";
import { loadRazorpay } from "./loadRazorpay";

export const createOrder = async (totalPrice) => {
  const response = await axiosInstance.post(CREATE_ORDER, {
    totalPrice,
  });
  return response.data;
};

export const handlePayment = async (order, user) => {
  const loaded = await loadRazorpay();

  if (!loaded) {
    toast.error("Failed to load Razorpay");
    throw new Error("Razorpay SDK load failed");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "TurfBuddy",
      description: "Book a spot for your next adventure",

      handler: (response) => {
        resolve(response);
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
          reject(new Error("Payment cancelled"));
        },
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  });
};
