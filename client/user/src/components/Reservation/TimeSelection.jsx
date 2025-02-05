import { parse, isAfter, addHours, addMinutes, format, isBefore } from "date-fns";

const TimeSelection = ({
  availableTimes,
  selectedStartTime,
  handleTimeSelection,
  isTimeSlotBooked,
  timeSlots,
  duration,
}) => {
  // const isTimeSlotSelected = (time) => time === selectedStartTime;
  const isTimeSlotSelected = (time) => {
    if (!selectedStartTime || !duration) return false;
    const start = parse(selectedStartTime, "hh:mm a", new Date());
    const end = addHours(start, duration);
    const current = parse(time, "hh:mm a", new Date());
    return current >= start && current < end;
  };

  const isTimeSlotDisabled = (time) => {
    const closeTime = parse(timeSlots.closeTime, "hh:mm a", new Date());
    const currentTime = parse(time, "hh:mm a", new Date());
    return isAfter(currentTime, closeTime) || isTimeSlotBooked(time);
  };
  const isMorningTime = (time) => {
    const morningStart = parse("5:00 AM", "hh:mm a", new Date());
    const eveningStartTime = parse("5:00 PM", "hh:mm a", new Date());
    const selectedTime = parse(time, "hh:mm a", new Date());
    return isAfter(selectedTime, morningStart) && isBefore(selectedTime, eveningStartTime);
  };
  const getButtonClassName = (time) => {
    const isMorning = isMorningTime(time);

    if (isTimeSlotSelected(time)) {
      return "bg-blue-500 hover:bg-blue-600 text-white";
    }

    if (isTimeSlotDisabled(time)) {
      return "btn-disabled";
    }

    return isMorning
      ? "btn-ghost" // Morning background (light)
      :"bg-primary hover:bg-green-800 text-white"; // Night background (darker)
  };

  return (
    <div>
   <h3 className="text-xl font-bold mb-4">Select Timeslots (30-minutes)</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4 ">
      {availableTimes.map((time) => {
  const startTime = parse(time, "hh:mm a", new Date());
  const endTime = addMinutes(startTime, 30);
  const formattedStartTime = format(startTime, "hh:mm");

  const formattedEndTime = format(endTime, "hh:mm a");

  return (
    <button
      key={time}
     
      className={`btn btn-sm border-gray-300 font-medium  ${getButtonClassName(time)}`}
      onClick={() => handleTimeSelection(time)}
      disabled={isTimeSlotDisabled(time)}
    >
      
      {`${formattedStartTime} - ${formattedEndTime}`}
    </button>
  );
})}

      </div>
    </div>
  );
};

export default TimeSelection;
// className={`btn btn-sm border-gray-300 ${
//   isTimeSlotSelected(time)
//     ? "bg-blue-500 hover:bg-blue-600 text-white"
//     : isTimeSlotDisabled(time)
//     ? "btn-disabled"
//     : isMorning
//     ? "btn-ghost" // Morning background
//     : "bg-gray-600 hover:bg-gray-900 text-white" // Night background
// }`}