import { useEffect, useMemo, useState } from "react";
import {
  format,
  parse,
  isBefore,
  isAfter,
  parseISO,
  addMinutes,
  addDays,
  isEqual,
  getDay,
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
  setAdvanceAmount
) => {
  const [priceAtMorning, setPriceAtMorning] = useState(0);

  const availableTimes = useMemo(() => {
    if (!timeSlots.openTime || !timeSlots.closeTime) return [];

    const times = [];
    const openTime = parse(timeSlots.openTime, "hh:mm a", new Date());
    let closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());
    // closeTime = addMinutes(closeTime, 30);

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
    const morningStart = parse("5:00 AM", "hh:mm a", new Date());
    const eveningStartTime = parse("5:00 PM", "hh:mm a", new Date());

    // Check if the selected time is between 5:00 AM and 5:00 PM (morning/day)
    if (
      isAfter(selectedTime, morningStart) &&
      isBefore(selectedTime, eveningStartTime)
    ) {
      setPricePerHour(priceAtMorning); // Use priceAtMorning for morning/day
    } else {
      setPricePerHour(timeSlots.pricePerHour); // Use pricePerHour for evening/night
    }
  };

  const isTimeSlotBooked = (time) => {
    const timeToCheck = parse(time, "hh:mm a", new Date());

    // Check for regular bookings and fixed schedules in bookedTime array
    return bookedTime.some((booking) => {
      let bookingStartHour, bookingStartMin, bookingEndHour, bookingEndMin;

      // Check if this is a fixed schedule (has isFixed flag and HH:mm format)
      if (booking.isFixed && booking.startTime && !booking.startTime.includes(' ')) {
        // HH:mm format (24-hour) for fixed schedules
        [bookingStartHour, bookingStartMin] = booking.startTime.split(':').map(Number);
        [bookingEndHour, bookingEndMin] = booking.endTime.split(':').map(Number);
      } else {
        // Regular booking with "hh:mm AM/PM" format
        const bookingStart = parse(booking.startTime, "hh:mm a", new Date());
        const bookingEnd = parse(booking.endTime, "hh:mm a", new Date());
        bookingStartHour = bookingStart.getHours();
        bookingStartMin = bookingStart.getMinutes();
        bookingEndHour = bookingEnd.getHours();
        bookingEndMin = bookingEnd.getMinutes();
      }

      // Get timeToCheck's hours and minutes
      const checkHour = timeToCheck.getHours();
      const checkMin = timeToCheck.getMinutes();

      // Convert all to minutes for easy comparison
      const checkTimeInMins = checkHour * 60 + checkMin;
      const bookingStartInMins = bookingStartHour * 60 + bookingStartMin;
      const bookingEndInMins = bookingEndHour * 60 + bookingEndMin;

      // Handle overnight bookings
      if (bookingEndInMins <= bookingStartInMins) {
        return checkTimeInMins >= bookingStartInMins || checkTimeInMins < bookingEndInMins;
      } else {
        return checkTimeInMins >= bookingStartInMins && checkTimeInMins < bookingEndInMins;
      }
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
      // Fetch time slots (now includes fixed schedules in bookedTime)
      const turfResponse = await axiosInstance.get(`/api/user/turf/timeslot?date=${date}&turfId=${turfId}`);

      const result = await turfResponse.data;
      setTimeSlots(result.timeSlots);
      setPricePerHour(result.timeSlots.pricePerHour);
      setPriceAtMorning(result.timeSlots.priceAtMorning); // Set morning price from API
      setAdvanceAmount(result.timeSlots.advancePayment);

      const formattedBookedTime = result.bookedTime.map((booking) => {
        // If it's a fixed schedule (has isFixed flag), it's already in the correct "HH:mm" format or similar
        // Ideally the API sends HH:mm string. Let's ensure consistency.
        if (booking.isFixed) {
          // If the backend sends startTime/endTime as "HH:mm", we can use them directly or format them if needed.
          // The current frontend logic for isTimeSlotBooked checks strictly for HH:mm strings for fixed schedules.
          return booking;
        }

        // Regular booking - convert ISO string to 12-hour format
        return {
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
        };
      });
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
    fetchByDate,
  };
};

export default useTimeSelection;
