import { useState, useEffect } from 'react';
import axiosInstance from '../../../hooks/useAxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const FixedScheduleManager = () => {
  const { turfId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    recurring: true
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  useEffect(() => {
    if (turfId) {
      fetchSchedules();
    }
  }, [turfId]);

  const fetchSchedules = async () => {
    if (!turfId) return;
    try {
      const response = await axiosInstance.get(`/api/owner/fixed-schedule/turf/${turfId}`);
      if (response.data.success) {
        setSchedules(response.data.fixedSchedules);
      }
    } catch (error) {
      console.error('Error fetching fixed schedules:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSchedule) {
        // Update existing schedule
        const response = await axiosInstance.put(
          `/api/owner/fixed-schedule/${editingSchedule._id}`,
          { ...formData, turfId }
        );
        if (response.data.success) {
          setSchedules(schedules.map(s => s._id === editingSchedule._id ? response.data.fixedSchedule : s));
          setShowModal(false);
        }
      } else {
        // Create new schedule
        const response = await axiosInstance.post('/api/owner/fixed-schedule', {
          ...formData,
          turfId
        });
        if (response.data.success) {
          setSchedules([...schedules, response.data.fixedSchedule]);
          setShowModal(false);
        }
      }
      setFormData({
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        recurring: true
      });
      setEditingSchedule(null);
    } catch (error) {
      console.error('Error saving fixed schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      description: schedule.description,
      recurring: schedule.recurring
    });
    setShowModal(true);
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this fixed schedule?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/owner/fixed-schedule/${scheduleId}`);
      if (response.data.success) {
        setSchedules(schedules.filter(s => s._id !== scheduleId));
      }
    } catch (error) {
      console.error('Error deleting fixed schedule:', error);
    }
  };

  const formatTime = (timeStr) => {
    // Convert HH:MM to 12-hour format with AM/PM
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayLabel = (dayValue) => {
    const day = daysOfWeek.find(d => d.value === dayValue);
    return day ? day.label : '';
  };

  if (!turfId) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Fixed Schedule Manager</h2>
            <p className="text-gray-500">Please select a turf to manage fixed schedules</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-lg">Fixed Schedules</h2>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingSchedule(null);
              setFormData({
                dayOfWeek: 0,
                startTime: '09:00',
                endTime: '10:00',
                description: '',
                recurring: true
              });
              setShowModal(true);
            }}
          >
            Add Fixed Schedule
          </button>
        </div>

        {schedules.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No fixed schedules yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Description</th>
                  <th>Recurring</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td>{getDayLabel(schedule.dayOfWeek)}</td>
                    <td>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</td>
                    <td>{schedule.description || '-'}</td>
                    <td>
                      <span className={`badge ${schedule.recurring ? 'badge-success' : 'badge-warning'}`}>
                        {schedule.recurring ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-xs btn-outline btn-info"
                          onClick={() => handleEdit(schedule)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => handleDelete(schedule._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for adding/editing fixed schedules */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {editingSchedule ? 'Edit Fixed Schedule' : 'Add Fixed Schedule'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Day of Week</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
                    required
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description (optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      checked={formData.recurring}
                      onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                    />
                    <span className="label-text">Recurring Weekly</span>
                  </label>
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : editingSchedule ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedScheduleManager;