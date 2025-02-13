import { useParams } from "react-router-dom";
import useDateSelection from "./useDateSelection";
import useTimeSelection from "./useTimeSelection";
import useDurationSelection from "./useDurationSelection";
import useBookingConfirmation from "./useBookingConfirmation";
import { useState } from "react";

const useReservation = (id, email) => {
  // const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [bookedTime, setBookedTime] = useState([]);
  const [timeSlots, setTimeSlots] = useState({ openTime: "", closeTime: "" });
  const [pricePerHour, setPricePerHour] = useState(0);
  const [duration, setDuration] = useState(1);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const { handleDateChange } = useDateSelection(
    setSelectedDate,
    setSelectedStartTime,
    setDuration
  );

  const { availableTimes, handleTimeSelection, isTimeSlotBooked, fetchByDate } =
    useTimeSelection(
      selectedDate,
      id,
      setSelectedStartTime,
      setBookedTime,
      setTimeSlots,
      setPricePerHour,
      bookedTime,
      timeSlots,
      setDuration,
      setAdvanceAmount
    );

  const { handleDurationChange, isDurationAvailable } = useDurationSelection(
    selectedStartTime,
    timeSlots,
    isTimeSlotBooked,
    setDuration
  );

  const { confirmReservation } = useBookingConfirmation(
    id,
    selectedDate,
    selectedStartTime,
    duration,
    pricePerHour,
    setLoading,
    email,
    advanceAmount,
    fetchByDate
  );

  return {
    selectedDate,
    selectedStartTime,
    duration,
    availableTimes,
    timeSlots,
    handleDateChange,
    handleTimeSelection,
    handleDurationChange,
    isTimeSlotBooked,
    isDurationAvailable,
    confirmReservation,
    pricePerHour,
    loading,
    advanceAmount,
  };
};

export default useReservation;
