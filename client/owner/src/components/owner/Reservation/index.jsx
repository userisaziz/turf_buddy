import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import DurationSelection from "./DurationSelection";
import ReservationSummary from "./ReservationSummary";
import ReservationSkeleton from "../ui/ReservationSkeleton.jsx";
import useReservation from "../../../hooks/owner/useReservation.jsx";
import React, { useState, useEffect } from "react";
import useTurfManagement from "../../../hooks/owner/useTurfManagement.jsx";
import axiosInstance from "../../../hooks/useAxiosInstance";
import FixedScheduleList from "./FixedScheduleList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  // State for time slot blocking/management
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({ start: '09:00', end: '10:00' });
  const [reason, setReason] = useState('');
  const [blockingDays, setBlockingDays] = useState([false, false, false, false, false, false, false]); // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  const [blockType, setBlockType] = useState('single'); // 'single' or 'recurring'
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockDate, setBlockDate] = useState(new Date()); // Independent date for blocking

  // State for managing fixed schedules list
  const [fixedSchedules, setFixedSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null); // ID of schedule being edited

  // Fetch fixed schedules when turf changes
  const fetchFixedSchedules = async () => {
    if (!formData.turfId) return;

    setSchedulesLoading(true);
    try {
      const response = await axiosInstance.get(`/api/owner/fixed-schedule/turf/${formData.turfId}`);
      if (response.data.success) {
        setFixedSchedules(response.data.fixedSchedules);
      }
    } catch (error) {
      console.error("Error fetching fixed schedules:", error);
    } finally {
      setSchedulesLoading(false);
    }
  };

  useEffect(() => {
    fetchFixedSchedules();
  }, [formData.turfId]);

  // Handle Edit Click
  const handleEditClick = (schedule) => {
    setEditingScheduleId(schedule._id);
    setSelectedTimeSlot({ start: schedule.startTime, end: schedule.endTime });
    setReason(schedule.description || '');
    setBlockType(schedule.recurring ? 'recurring' : 'single');

    if (schedule.recurring) {
      const newBlockingDays = [false, false, false, false, false, false, false];
      newBlockingDays[schedule.dayOfWeek] = true;
      setBlockingDays(newBlockingDays);
    } else {
      setBlockDate(schedule.date ? new Date(schedule.date) : new Date());
    }

    setBlockModalOpen(true);
  };

  // Handle Reset Form
  const resetBlockForm = () => {
    setEditingScheduleId(null);
    setReason('');
    setSelectedTimeSlot({ start: '09:00', end: '10:00' });
    setBlockType('single');
    setBlockingDays([false, false, false, false, false, false, false]);
    setBlockDate(selectedDate);
  };

  const handleBlockModalClose = () => {
    setBlockModalOpen(false);
    resetBlockForm();
  };

  const handleBlockTimeSlot = async (e) => {
    e.preventDefault();
    if (selectedTimeSlot.start >= selectedTimeSlot.end) {
      alert("End time must be after start time");
      return;
    }
    setIsBlocking(true);

    try {
      if (editingScheduleId) {
        // UPDATE existing schedule
        // Logic slightly different as we update specific ID
        const updateData = {
          startTime: selectedTimeSlot.start,
          endTime: selectedTimeSlot.end,
          description: reason,
          recurring: blockType === 'recurring',
        };

        if (blockType === 'single') {
          updateData.date = blockDate;
          updateData.dayOfWeek = blockDate.getDay();
        } else {
          // For edit, we might restrict changing days for simplicity or handle it.
          // If recurring, we need to know which day. 
          // The current UI multiselects days for creating multiple. 
          // For EDITING, it implies editing a SINGLE schedule object which is for ONE day.
          // We should probably enforce single day selection if editing recurring.
          const selectedDayIndex = blockingDays.findIndex(d => d);
          if (selectedDayIndex === -1) throw new Error("Please select a day for recurring schedule");
          updateData.dayOfWeek = selectedDayIndex;
        }

        const response = await axiosInstance.put(`/api/owner/fixed-schedule/${editingScheduleId}`, updateData);

        if (response.data.success) {
          alert('Time slot updated successfully!');
          handleBlockModalClose();
          fetchFixedSchedules();
          // Refresh main reservation data?
          // window.location.reload(); // Avoid reload, just refetch
          // Trigger a refetch of availability using a hack or exposing fetch method
        }

      } else {
        // CREATE new schedule(s)
        if (blockType === 'single') {
          // Block a single date/time slot
          const response = await axiosInstance.post('/api/owner/fixed-schedule', {
            turfId: formData.turfId,
            dayOfWeek: blockDate.getDay(), // 0 = Sunday, 1 = Monday, etc.
            startTime: selectedTimeSlot.start,
            endTime: selectedTimeSlot.end,
            description: reason || 'Blocked by owner',
            recurring: false,
            date: blockDate
          });

          if (response.data.success) {
            alert('Time slot blocked successfully!');
            handleBlockModalClose();
            fetchFixedSchedules();
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
          handleBlockModalClose();
          fetchFixedSchedules();
        }
      }
    } catch (error) {
      console.error('Error saving time slot:', error);
      alert('Error saving time slot: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blocked slot?")) return;
    try {
      await axiosInstance.delete(`/api/owner/fixed-schedule/${id}`);
      fetchFixedSchedules();
    } catch (error) {
      console.error("Error deleting schedule", error);
      alert("Failed to delete schedule");
    }
  };

  const toggleDaySelection = (dayIndex) => {
    // If editing, allow only one day selection to keep it simple mapping to one schedule object
    if (editingScheduleId && blockType === 'recurring') {
      const newBlockingDays = [false, false, false, false, false, false, false];
      newBlockingDays[dayIndex] = !blockingDays[dayIndex]; // Toggle the clicked one, ensuring only 1 active max effectively
      setBlockingDays(newBlockingDays);
      return;
    }

    const newBlockingDays = [...blockingDays];
    newBlockingDays[dayIndex] = !newBlockingDays[dayIndex];
    setBlockingDays(newBlockingDays);
  };

  if (loading) return <ReservationSkeleton />;

  const [activeTab, setActiveTab] = useState("reservation");

  // Time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Reservations</h2>
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

          {/* Tabs */}
          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${activeTab === "reservation" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("reservation")}
            >
              New Reservation
            </a>
            <a
              className={`tab ${activeTab === "blocked" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("blocked")}
            >
              Blocked Time Slots
            </a>
          </div>

          {/* Block Time Slot Modal */}
          {blockModalOpen && (
            <div className="modal modal-open">
              <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">{editingScheduleId ? 'Edit Blocked Slot' : 'Block Time Slot'}</h3>

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

                  {blockType === 'single' && (
                    <div className="mb-4">
                      <label className="label">
                        <span className="label-text">Select Date</span>
                      </label>
                      <DatePicker
                        selected={blockDate}
                        onChange={(date) => setBlockDate(date)}
                        dateFormat="dd-MM-yyyy"
                        minDate={new Date()}
                        className="input input-bordered w-full"
                      />
                    </div>
                  )}

                  {blockType === 'recurring' && (
                    <div className="mb-4">
                      <label className="label">
                        <span className="label-text">Select Days of Week {editingScheduleId && '(Select one)'}</span>
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
                        onChange={(e) => {
                          const newStart = e.target.value;
                          let newEnd = selectedTimeSlot.end;
                          if (newEnd <= newStart) {
                            // Find next available time slot
                            const startIndex = timeOptions.indexOf(newStart);
                            if (startIndex !== -1 && startIndex < timeOptions.length - 1) {
                              newEnd = timeOptions[startIndex + 1];
                            } else {
                              // If last slot selected, maybe handle edge case or let end be same (validation fails)
                              // or wrap to next day logic? For now, just try to set next.
                            }
                          }
                          setSelectedTimeSlot({ start: newStart, end: newEnd });
                        }}
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
                        onChange={(e) => setSelectedTimeSlot({ ...selectedTimeSlot, end: e.target.value })}
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
                      onClick={handleBlockModalClose}
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
                          Saving...
                        </>
                      ) : (
                        editingScheduleId ? 'Update Block' : `Block Time Slot${blockType === 'recurring' && !editingScheduleId ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === "reservation" && (
            <div>
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
          )}

          {activeTab === "blocked" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  className="btn btn-accent"
                  onClick={() => { resetBlockForm(); setBlockModalOpen(true); }}
                >
                  Block Time Slot
                </button>
              </div>

              <FixedScheduleList
                schedules={fixedSchedules}
                onEdit={handleEditClick}
                onDelete={handleDeleteSchedule}
                isLoading={schedulesLoading}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Reservation;
