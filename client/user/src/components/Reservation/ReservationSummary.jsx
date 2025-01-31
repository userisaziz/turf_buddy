import { format } from "date-fns";
import { getEndTime } from "../../utils/dateUtils";

const ReservationSummary = ({
  selectedDate,
  selectedStartTime,
  duration,
  pricePerHour,
  advanceAmount,
}) => {

  return (
    <div className="mt-6 p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Your Reservation</h3>
      <p>Date: {format(selectedDate, "dd-MM-yyyy")}</p>
      <p>
        Time: {selectedStartTime} to {getEndTime(selectedStartTime, duration)}
      </p>
      <p>
        Duration: {duration} hour{duration > 1 ? "s" : ""}
      </p>
      <div className="space-y-2">
  <div className="flex justify-between">
    <span className="text-gray-700">Total Price:</span>
    <span className="font-bold">{pricePerHour * duration} INR</span>
  </div>
  <div className="flex justify-between">
    <span className="text-gray-700">Advance Price:</span>
    <span className="font-bold">{advanceAmount} INR</span>
  </div>
  <div className="flex justify-between border-t pt-2">
    <span className="text-gray-700">Pay after Play:</span>
    <span className="font-bold">
      {pricePerHour * duration - advanceAmount} INR
    </span>
  </div>
</div>
    </div>
  );
};

export default ReservationSummary;
