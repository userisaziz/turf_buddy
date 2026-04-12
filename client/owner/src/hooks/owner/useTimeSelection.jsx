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

    // Check for regular bookings and fixed schedules in bookedTime array
    const isRegularBooking = bookedTime.some((booking) => {
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

    // Check for fixed schedule conflicts
    const isFixedScheduleConflict = fixedSchedules.some((schedule) => {
      // API should return startTime/endTime as "HH:mm" 24-hour format strings
      // But handle ISO date strings as fallback for backwards compatibility
      let schedStartHour, schedStartMin, schedEndHour, schedEndMin;

      // Check if startTime is an ISO string (contains 'T') or HH:mm format
      if (schedule.startTime && schedule.startTime.includes('T')) {
        // ISO format - parse the hours/minutes from the ISO string
        const startDate = new Date(schedule.startTime);
        const endDate = new Date(schedule.endTime);
        schedStartHour = startDate.getUTCHours();
        schedStartMin = startDate.getUTCMinutes();
        schedEndHour = endDate.getUTCHours();
        schedEndMin = endDate.getUTCMinutes();
      } else {
        // HH:mm format - split and parse
        [schedStartHour, schedStartMin] = schedule.startTime.split(':').map(Number);
        [schedEndHour, schedEndMin] = schedule.endTime.split(':').map(Number);
      }

      // Get timeToCheck's hours and minutes
      const checkHour = timeToCheck.getHours();
      const checkMin = timeToCheck.getMinutes();

      // Convert all to minutes for easy comparison
      const checkTimeInMins = checkHour * 60 + checkMin;
      const schedStartInMins = schedStartHour * 60 + schedStartMin;
      const schedEndInMins = schedEndHour * 60 + schedEndMin;

      // Check if time falls within the blocked range
      // For overnight blocks (end < start), handle separately
      if (schedEndInMins <= schedStartInMins) {
        // Overnight: blocked if time >= start OR time < end
        return checkTimeInMins >= schedStartInMins || checkTimeInMins < schedEndInMins;
      } else {
        // Normal: blocked if start <= time < end
        return checkTimeInMins >= schedStartInMins && checkTimeInMins < schedEndInMins;
      }
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
        axiosInstance.post('/api/owner/fixed-schedule/by-date-range', {
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
      const formattedBookedTime = result.bookedTime.map((booking) => {
        // If it's a fixed schedule (has isFixed flag and HH:mm format), keep as-is
        if (booking.isFixed) {
          return booking; // Already in correct format with HH:mm strings
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
