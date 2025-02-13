import { format, parse, set, formatISO, addHours, parseISO } from "date-fns";
import toast from "react-hot-toast";
import axiosInstance from "./useAxiosInstance";
import { createOrder, handlePayment } from "../config/razorpay";
import "https://checkout.razorpay.com/v1/checkout.js";
import { useNavigate } from "react-router-dom";
import { VERIFY_PAYMENT, VERIFY_TIMESLOT } from "../api/endpoint";

const useBookingConfirmation = (
  id,
  selectedDate,
  selectedStartTime,
  duration,
  pricePerHour,
  setLoading,
  advanceAmount,
  fetchByDate
) => {
  const navigate = useNavigate();
  const confirmReservation = async () => {
    const selectedTurfDate = format(selectedDate, "yyyy-MM-dd");
    const parsedStartTime = parse(selectedStartTime, "hh:mm a", new Date());

    const combinedStartDateTime = set(parseISO(selectedTurfDate), {
      hours: parsedStartTime.getHours(),
      minutes: parsedStartTime.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    const combinedEndDateTime = addHours(combinedStartDateTime, duration);

    const startTimeISO = formatISO(combinedStartDateTime);
    const endTimeISO = formatISO(combinedEndDateTime);

    try {
      setLoading(true);

      // const order = await createOrder(pricePerHour * duration);

      // Step 1: Verify if the timeslot is available
      const timeslotData = {
        turfId: id, // Assuming `id` is the turfId
        startTime: startTimeISO,
        endTime: endTimeISO,
        selectedTurfDate,
      };

      const timeslotResponse = await axiosInstance.post(VERIFY_TIMESLOT, timeslotData);

      if (!timeslotResponse.data.success) {

        toast.error(timeslotResponse.data.message);
        setLoading(false);
        window.location.reload(); 
        return;
      }
      
      const order = await createOrder(advanceAmount);
      setLoading(false);

      const razorpayResponse = await handlePayment(order.order, order.user);
      setLoading(true);
      const bookingData = {
        id,
        duration,
        startTime: startTimeISO,
        endTime: endTimeISO,
        totalPrice: pricePerHour * duration,
        selectedTurfDate,
        paymentId: razorpayResponse.razorpay_payment_id,
        orderId: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      };

      const response = await axiosInstance.post(VERIFY_PAYMENT, bookingData);
      const result = await response.data;
      toast.success(result.message);
      navigate("/auth/booking-history");
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmReservation,
  };
};

export default useBookingConfirmation;
