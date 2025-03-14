import {
  parse,
  isAfter,
  addHours,
  format,
  isBefore,
  isEqual,
  addMinutes,
  addDays,
} from "date-fns";

const useDurationSelection = (
  selectedStartTime,
  timeSlots,
  isTimeSlotBooked,
  setDuration
) => {
  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  // const isDurationAvailable = (startTime, hours) => {
  //   if (!startTime) return false;

  //   const start = parse(startTime, "hh:mm a", new Date());
  //   const end = addHours(start, hours);

  //   let closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());
  //   if (isBefore(closeTime, start) || isEqual(closeTime, start)) {
  //     closeTime = addDays(closeTime, 1);
  //   }

  //   if (isAfter(end, closeTime)) return false;

  //   for (let i = 0; i < hours; i++) {
  //     const checkTime = addHours(start, i);
  //     if (isTimeSlotBooked(format(checkTime, "hh:mm a"))) {
  //       return false;
  //     }
  //   }

  //   return true;
  // };
  const isDurationAvailable = (startTime, hours) => {
    if (!startTime) return false;

    const start = parse(startTime, "hh:mm a", new Date());
    const end = addHours(start, hours);

    let closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());
    closeTime = addMinutes(closeTime, 30);
    if (isBefore(closeTime, start) || isEqual(closeTime, start)) {
      closeTime = addDays(closeTime, 1);
    }

    if (isAfter(end, closeTime)) return false;

    for (let i = 0; i < hours * 2; i++) {
      // Check every 30-min interval within the duration
      const checkTime = addMinutes(start, i * 30);
      if (isTimeSlotBooked(format(checkTime, "hh:mm a"))) {
        return false;
      }
    }

    return true;
  };

  return {
    handleDurationChange,
    isDurationAvailable,
  };
};

export default useDurationSelection;
