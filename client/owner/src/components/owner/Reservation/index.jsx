import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import DurationSelection from "./DurationSelection";
import ReservationSummary from "./ReservationSummary";

import ReservationSkeleton from "../ui/ReservationSkeleton.jsx";
import useReservation from "../../../hooks/owner/useReservation.jsx";
import React, { useState, useEffect } from "react";
import useTurfManagement from "../../../hooks/owner/useTurfManagement.jsx";

const Reservation = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    turfId: "",
    selectedDate: new Date(),
    selectedStartTime: "",
    duration: 1,
    totalPrice: "",
  });

  const { turfs, fetchTurfs } = useTurfManagement();
  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleTurfChange = (e) => {
    const turf = turfs.find((t) => t._id === e.target.value);
    setFormData({
      ...formData,
      turfId: turf._id,
      totalPrice: turf.pricePerHour * formData.duration,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
  } = useReservation(formData.turfId);

  if (loading) return <ReservationSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">Reserve Turf</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <div>
            <label className="label">
              <span className="label-text">User Email</span>
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Select Turf</span>
            </label>
            <select
              name="turfId"
              value={formData.turfId}
              onChange={handleTurfChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Select a Turf
              </option>
              {turfs.map((turf) => (
                <option key={turf._id} value={turf._id}>
                  {turf.name} - {turf.location}
                </option>
              ))}
            </select>
          </div>
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
