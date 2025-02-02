import { parse, isAfter, addHours, addMinutes, format } from "date-fns";

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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Start Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
        {/* {availableTimes.map((time) => (
          <button
            key={time}
            className={`btn btn-sm ${
              isTimeSlotSelected(time)
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : isTimeSlotDisabled(time)
                ? "btn-disabled"
                : "btn-ghost"
            }`}
            onClick={() => handleTimeSelection(time)}
            disabled={isTimeSlotDisabled(time)}
          >
            {time}
          </button>
        ))} */}
             {availableTimes.map((time) => {
  const startTime = parse(time, "hh:mm a", new Date());
  const endTime = addMinutes(startTime, 30);
  const formattedEndTime = format(endTime, "hh:mm a");

  return (
    <button
      key={time}
      className={`btn btn-sm border-gray-300 ${
        isTimeSlotSelected(time)
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : isTimeSlotDisabled(time)
          ? "btn-disabled"
          : "btn-ghost"
      }`}
      onClick={() => handleTimeSelection(time)}
      disabled={isTimeSlotDisabled(time)}
    >
      {`${time} - ${formattedEndTime}`}
    </button>
  );
})}
      </div>
    </div>
  );
};

export default TimeSelection;
