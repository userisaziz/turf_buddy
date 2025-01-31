import { useEffect, useMemo, useState } from "react";
import {
  format,
  parse,
  isBefore,
  isAfter,
  parseISO,
  addMinutes,
  addDays,
} from "date-fns";
import axiosInstance from "./useAxiosInstance";

const useTimeSelection = (
  selectedDate,
  turfId,
  setSelectedStartTime,
  setBookedTime,
  setTimeSlots,
  setPricePerHour,
  bookedTime,
  timeSlots,
  setDuration,
  setAdvanceAmount,
) => {
  const [priceAtMorning, setPriceAtMorning] = useState(0); 

  const availableTimes = useMemo(() => {
    if (!timeSlots.openTime || !timeSlots.closeTime) return [];

    const times = [];
    const openTime = parse(timeSlots.openTime, "hh:mm a", new Date());
    const closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());

    let currentTime = openTime;

    while (isBefore(currentTime, closeTime)) {
      times.push(format(currentTime, "hh:mm a"));
      currentTime = addMinutes(currentTime, 30);
    }

    return times;
  }, [timeSlots.openTime, timeSlots.closeTime]);

  const handleTimeSelection = (time) => {
    setSelectedStartTime(time);
    setDuration(1);

    // Calculate the price based on the selected start time
    const selectedTime = parse(time, "hh:mm a", new Date());
    const eveningStartTime = parse("05:00 PM", "hh:mm a", new Date());

    if (isAfter(selectedTime, eveningStartTime) || isSameTime(selectedTime, eveningStartTime)) {
      setPricePerHour(timeSlots.pricePerHour); // Use pricePerHour for evening/night
    } else {
      setPricePerHour(priceAtMorning); // Use priceAtMorning for morning/day
    }
  };

  const isTimeSlotBooked = (time) => {
    const timeToCheck = parse(time, "hh:mm a", new Date());
    return bookedTime.some((booking) => {
      const bookingStart = parse(booking.startTime, "hh:mm a", new Date());
      let bookingEnd = parse(booking.endTime, "hh:mm a", new Date());

      if (isBefore(bookingEnd, bookingStart)) {
        bookingEnd = addDays(bookingEnd, 1);
      }

      return (
        (isAfter(timeToCheck, bookingStart) ||
          isSameTime(timeToCheck, bookingStart)) &&
        isBefore(timeToCheck, bookingEnd)
      );
    });
  };

  const isSameTime = (time1, time2) => {
    return (
      time1.getHours() === time2.getHours() &&
      time1.getMinutes() === time2.getMinutes()
    );
  };

  const fetchByDate = async (currentSelectedDate, turfId) => {
    const date = format(currentSelectedDate, "yyyy-MM-dd");

    try {
      const response = await axiosInstance.get(
        `/api/user/turf/timeslot?date=${date}&turfId=${turfId}`
      );
      const result = await response.data;
      setTimeSlots(result.timeSlots);
      setPricePerHour(result.timeSlots.pricePerHour);
      setPriceAtMorning(result.timeSlots.priceAtMorning); // Set morning price from API
      setAdvanceAmount(result.timeSlots.advancePayment)
      const formattedBookedTime = result.bookedTime.map((booking) => ({
        ...booking,
        startTime: format(
          addMinutes(
            parseISO(booking.startTime),
            parseISO(booking.startTime).getTimezoneOffset()
          ),
          "hh:mm a",
          { timeZone: "UTC" }
        ),
        endTime: format(
          addMinutes(
            parseISO(booking.endTime),
            parseISO(booking.endTime).getTimezoneOffset()
          ),
          "hh:mm a",
          { timeZone: "UTC" }
        ),
      }));
      setBookedTime(formattedBookedTime);
    } catch (error) {
      console.log("Error in fetchByDate", error.message);
    }
  };

  useEffect(() => {
    fetchByDate(selectedDate, turfId);
  }, [selectedDate, turfId]);

  return {
    availableTimes,
    handleTimeSelection,
    isTimeSlotBooked,
  };
};

export default useTimeSelection;