import { format, parse, set, formatISO, addHours, parseISO } from "date-fns";
import toast from "react-hot-toast";

import { createOrder, handlePayment } from "../../config/razorpay.js";
import "https://checkout.razorpay.com/v1/checkout.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../useAxiosInstance.js";
import { VERIFY_PAYMENT, VERIFY_TIMESLOT } from "../../api/endpoint.js";

const useBookingConfirmation = (
  id,
  selectedDate,
  selectedStartTime,
  duration,
  pricePerHour,
  setLoading,
  email,
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
    const adminEmail = "azizadnan370@gmail.com";
    try {
      setLoading(true);

      // const order = await createOrder(pricePerHour * duration, email);
      // const order = await createOrder(advanceAmount, adminEmail);
      // setLoading(false);

      // const razorpayResponse = await handlePayment(order.order, order.user);
      // setLoading(true);
      const timeslotData = {
        turfId: id, // Assuming `id` is the turfId
        startTime: startTimeISO,
        endTime: endTimeISO,
        date: selectedTurfDate,
        selectedTurfDate,
      };
      const timeslotResponse = await axiosInstance.post(
        VERIFY_TIMESLOT,
        timeslotData
      );

      if (!timeslotResponse.data.success) {
        toast.error(timeslotResponse.data.message);
        setLoading(false);
        window.location.reload();
        return;
      }

      const bookingData = {
        id,
        userEmail: adminEmail,
        duration,
        startTime: startTimeISO,
        endTime: endTimeISO,
        totalPrice: pricePerHour * duration,
        date: selectedTurfDate,
        selectedTurfDate,
        // paymentId: razorpayResponse.razorpay_payment_id,
        // orderId: razorpayResponse.razorpay_order_id,
        // razorpay_signature: razorpayResponse.razorpay_signature,
        paymentMethod: "cash",
      };

      const response = await axiosInstance.post(VERIFY_PAYMENT, bookingData);
      const result = await response.data;
      toast.success(result.message);
      navigate("/owner/bookings");
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // const confirmReservation = async () => {
  //   const selectedTurfDate = format(selectedDate, "yyyy-MM-dd");
  //   const parsedStartTime = parse(selectedStartTime, "hh:mm a", new Date());
  //   const combinedStartDateTime = set(parseISO(selectedTurfDate), {
  //     hours: parsedStartTime.getHours(),
  //     minutes: parsedStartTime.getMinutes(),
  //     seconds: 0,
  //     milliseconds: 0,
  //   });

  //   const combinedEndDateTime = addHours(combinedStartDateTime, duration);

  //   const startTimeISO = formatISO(combinedStartDateTime);
  //   const endTimeISO = formatISO(combinedEndDateTime);

  //   try {
  //     const response = await axiosInstance.post(
  //       "/api/owner/bookings/create-order",
  //       {
  //         // ...formData,
  //         userEmail: "Ahmed1@gmail.com",
  //         turfId: id,
  //         startTime: startTimeISO,
  //         endTime: endTimeISO,
  //         selectedTurfDate: selectedTurfDate,
  //         totalPrice: pricePerHour * duration,
  //       }
  //     );
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };

  return {
    confirmReservation,
  };
};

export default useBookingConfirmation;
