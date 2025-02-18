import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import DurationSelection from "./DurationSelection";
import ReservationSummary from "./ReservationSummary";
import useReservation from "../../hooks/useReservation";
import ReservationSkeleton from "../ui/ReservationSkeleton";
import { Info } from "lucide-react";

const Reservation = () => {
  const {
    selectedDate,
    selectedStartTime,
    duration,
    availableTimes,
    timeSlots,
    pricePerHour,
    handleDateChange,
    handleTimeSelection,
    handleDurationChange,
    isTimeSlotBooked,
    isDurationAvailable,
    confirmReservation,
    loading,
    advanceAmount,
  } = useReservation();

if( loading) return <ReservationSkeleton />;

  return (
    <div className="container mx-auto px-2 py-8">
      <h2 className="text-2xl font-bold mb-6">Reserve Turf</h2>
           {/* Pricing Info Banner */}
           <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" />
        <div>
          <p className="font-medium">Pricing Information</p>
          <p className="text-sm">
           Discount Price apply when booked in between 
            <strong>
{' '}
            5:00 AM to  5:00 PM  {' '}
            </strong>
    
            {/* <span className="block mt-1 text-blue-700/90">
              Price calculation is based on your selected time slot.
            </span> */}
          </p>
        </div>
        </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <DateSelection
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
          <TimeSelection
            availableTimes={availableTimes}
            selectedStartTime={selectedStartTime}
            handleTimeSelection={handleTimeSelection}
            isTimeSlotBooked={isTimeSlotBooked}
            timeSlots={timeSlots}
            duration={duration}
          />
          {selectedStartTime && (
            <DurationSelection
              selectedStartTime={selectedStartTime}
              duration={duration}
              handleDurationChange={handleDurationChange}
              isDurationAvailable={isDurationAvailable}
            />
          )}
          {selectedStartTime && duration > 0 && (
            <ReservationSummary
              selectedDate={selectedDate}
              selectedStartTime={selectedStartTime}
              duration={duration}
              pricePerHour={pricePerHour}
              advanceAmount={advanceAmount}
            />
          )}
          <div className="mt-6">
            <button
              className="btn btn-primary w-full relative"
              disabled={
                !selectedStartTime ||
                !isDurationAvailable(selectedStartTime, duration) ||
                loading
              }
              onClick={confirmReservation}
            >
              {loading ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </span>
              ) : (
                "Confirm Reservation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
