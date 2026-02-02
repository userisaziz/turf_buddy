import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import DurationSelection from "./DurationSelection";
import ReservationSummary from "./ReservationSummary";
import ReservationSkeleton from "../ui/ReservationSkeleton.jsx";
import useReservation from "../../../hooks/owner/useReservation.jsx";
import React, { useState, useEffect } from "react";
import useTurfManagement from "../../../hooks/owner/useTurfManagement.jsx";
import axiosInstance from "../../../hooks/useAxiosInstance";

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

  // Set first turf as default when turfs are loaded
  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (turfs.length > 0 && !formData.turfId) {
      const defaultTurf = turfs[0];
      setFormData(prev => ({
        ...prev,
        turfId: defaultTurf._id,
        totalPrice: defaultTurf.pricePerHour * prev.duration,
      }));
    }
  }, [turfs]);

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
    advanceAmount,
  } = useReservation(formData.turfId, formData.userEmail);

  if (loading) return <ReservationSkeleton />;

  // State for time slot blocking
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({ start: '09:00', end: '10:00' });
  const [reason, setReason] = useState('');
  const [blockingDays, setBlockingDays] = useState([false, false, false, false, false, false, false]); // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  const [blockType, setBlockType] = useState('single'); // 'single' or 'recurring'
  const [isBlocking, setIsBlocking] = useState(false);

  // Time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  const handleBlockTimeSlot = async (e) => {
    e.preventDefault();
    setIsBlocking(true);

    try {
      if (blockType === 'single') {
        // Block a single date/time slot
        const response = await axiosInstance.post('/api/owner/fixed-schedule', {
          turfId: formData.turfId,
          dayOfWeek: selectedDate.getDay(), // 0 = Sunday, 1 = Monday, etc.
          startTime: selectedTimeSlot.start,
          endTime: selectedTimeSlot.end,
          description: reason || 'Blocked by owner',
          recurring: false
        });

        if (response.data.success) {
          alert('Time slot blocked successfully!');
          setBlockModalOpen(false);
          setReason('');
          // Refresh the reservation data to show the blocked slot
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        // Block recurring time slots for selected days
        const selectedDays = blockingDays.map((isSelected, index) => isSelected ? index : null).filter(day => day !== null);
        
        for (const day of selectedDays) {
          const response = await axiosInstance.post('/api/owner/fixed-schedule', {
            turfId: formData.turfId,
            dayOfWeek: day,
            startTime: selectedTimeSlot.start,
            endTime: selectedTimeSlot.end,
            description: reason || 'Recurring block',
            recurring: true
          });
          
          if (!response.data.success) {
            throw new Error(`Failed to block for ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}`);
          }
        }
        
        alert('Time slots blocked successfully!');
        setBlockModalOpen(false);
        setReason('');
        setBlockingDays([false, false, false, false, false, false, false]);
        // Refresh the reservation data to show the blocked slot
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error blocking time slot:', error);
      alert('Error blocking time slot: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsBlocking(false);
    }
  };

  const toggleDaySelection = (dayIndex) => {
    const newBlockingDays = [...blockingDays];
    newBlockingDays[dayIndex] = !newBlockingDays[dayIndex];
    setBlockingDays(newBlockingDays);
  };

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Reservations</h2>
        <button 
          className="btn btn-accent"
          onClick={() => setBlockModalOpen(true)}
        >
          Block Time Slot
        </button>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
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
              {turfs.map((turf) => (
                <option key={turf._id} value={turf._id}>
                  {turf.name} - {turf.location}
                </option>
              ))}
            </select>
          </div>

          {/* Block Time Slot Modal */}
          {blockModalOpen && (
            <div className="modal modal-open">
              <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Block Time Slot</h3>
                
                <form onSubmit={handleBlockTimeSlot}>
                  <div className="mb-4">
                    <label className="label">
                      <span className="label-text">Block Type</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="cursor-pointer label">
                        <input
                          type="radio"
                          name="blockType"
                          className="radio radio-primary"
                          checked={blockType === 'single'}
                          onChange={() => setBlockType('single')}
                        />
                        <span className="label-text ml-2">Single Date</span>
                      </label>
                      <label className="cursor-pointer label">
                        <input
                          type="radio"
                          name="blockType"
                          className="radio radio-primary"
                          checked={blockType === 'recurring'}
                          onChange={() => setBlockType('recurring')}
                        />
                        <span className="label-text ml-2">Recurring</span>
                      </label>
                    </div>
                  </div>

                  {blockType === 'recurring' && (
                    <div className="mb-4">
                      <label className="label">
                        <span className="label-text">Select Days of Week</span>
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <button
                            key={day}
                            type="button"
                            className={`btn btn-sm ${blockingDays[index] ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => toggleDaySelection(index)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Start Time</span>
                      </label>
                      <select
                        value={selectedTimeSlot.start}
                        onChange={(e) => setSelectedTimeSlot({...selectedTimeSlot, start: e.target.value})}
                        className="input input-bordered w-full"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">End Time</span>
                      </label>
                      <select
                        value={selectedTimeSlot.end}
                        onChange={(e) => setSelectedTimeSlot({...selectedTimeSlot, end: e.target.value})}
                        className="input input-bordered w-full"
                      >
                        {timeOptions.filter(time => time > selectedTimeSlot.start).map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="label">
                      <span className="label-text">Reason (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for blocking (e.g., maintenance, private event)"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setBlockModalOpen(false)}
                      disabled={isBlocking}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isBlocking || (blockType === 'recurring' && !blockingDays.some(day => day))}
                    >
                      {isBlocking ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Blocking...
                        </>
                      ) : (
                        `Block Time Slot${blockType === 'recurring' ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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