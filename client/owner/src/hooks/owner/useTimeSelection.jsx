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
import axiosInstance from "../useAxiosInstance";

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
  const [fixedSchedules, setFixedSchedules] = useState([]);

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

  // const isTimeSlotBooked = (time) => {
  //   const timeToCheck = parse(time, "hh:mm a", new Date());
  //   return bookedTime.some((booking) => {
  //     const bookingStart = parse(booking.startTime, "hh:mm a", new Date());
  //     let bookingEnd = parse(booking.endTime, "hh:mm a", new Date());

  //     if (isBefore(bookingEnd, bookingStart)) {
  //       bookingEnd = addDays(bookingEnd, 1);
  //     }

  //     return (
  //       (isAfter(timeToCheck, bookingStart) ||
  //         isSameTime(timeToCheck, bookingStart)) &&
  //       isBefore(timeToCheck, bookingEnd)
  //     );
  //   });
  // };
  const isTimeSlotBooked = (time) => {
    const timeToCheck = parse(time, "hh:mm a", new Date());

    // Check for regular bookings
    const isRegularBooking = bookedTime.some((booking) => {
      const bookingStart = parse(booking.startTime, "hh:mm a", new Date());
      let bookingEnd = parse(booking.endTime, "hh:mm a", new Date());

      if (isBefore(bookingEnd, bookingStart)) {
        bookingEnd = addDays(bookingEnd, 1);
      }

      return (
        (isAfter(timeToCheck, bookingStart) ||
          isEqual(timeToCheck, bookingStart)) &&
        isBefore(timeToCheck, bookingEnd)
      );
    });
    
    // Check for fixed schedule conflicts
    const dayOfWeek = getDay(selectedDate); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isFixedScheduleConflict = fixedSchedules.some((schedule) => {
      const scheduleStart = parse(schedule.startTime, "HH:mm", new Date());
      let scheduleEnd = parse(schedule.endTime, "HH:mm", new Date());
      
      // If end time is before start time, it means it's overnight
      if (isBefore(scheduleEnd, scheduleStart)) {
        scheduleEnd = addDays(scheduleEnd, 1);
      }
      
      return (
        (isAfter(timeToCheck, scheduleStart) ||
          isEqual(timeToCheck, scheduleStart)) &&
        isBefore(timeToCheck, scheduleEnd)
      );
    });
    
    return isRegularBooking || isFixedScheduleConflict;
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
      // Fetch both time slots and fixed schedules
      const [turfResponse, fixedScheduleResponse] = await Promise.all([
        axiosInstance.get(`/api/user/turf/timeslot?date=${date}&turfId=${turfId}`),
        axiosInstance.post('/api/user/booking/get-fixed-schedules-by-date-range', {
          turfId,
          startDate: date,
          endDate: date
        })
      ]);
      
      const result = await turfResponse.data;
      setTimeSlots(result.timeSlots);
      setPricePerHour(result.timeSlots.pricePerHour);
      setPriceAtMorning(result.timeSlots.priceAtMorning); // Set morning price from API
      // setAdvanceAmount(result.timeSlots.advancePayment);
      setAdvanceAmount(0);
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
      
      // Set fixed schedules if available
      if (fixedScheduleResponse.data.success) {
        setFixedSchedules(fixedScheduleResponse.data.fixedSchedules);
      } else {
        setFixedSchedules([]);
      }
    } catch (error) {
      console.log("Error in fetchByDate", error.message);
    }
  };

  useEffect(() => {
    turfId && fetchByDate(selectedDate, turfId);
  }, [selectedDate, turfId]);

  return {
    availableTimes,
    handleTimeSelection,
    isTimeSlotBooked,
    fetchByDate,
  };
};

export default useTimeSelection;
