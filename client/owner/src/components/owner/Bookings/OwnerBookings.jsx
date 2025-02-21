import useOwnerBookings from "@hooks/owner/useOwnerBookings";
import BookingsSkeleton from "./BookingsSkeleton";
import { format } from "date-fns";
import { ArrowUpDown, Calendar, Clock, IndianRupee } from "lucide-react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";

const OwnerBookings = () => {
  const {
    bookings,
    loading,
    error,
    filterDays,
    setFilterDays,
    sortConfig,
    deleteBooking,
    isModalOpen,
    setIsModalOpen,
    setSelectedBookingId,
    requestSort,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  } = useOwnerBookings();

  if (loading) return <BookingsSkeleton />;
  if (error) return <div className="alert alert-error shadow-lg">{error}</div>;

  const getSortDirection = (name) => {
    if (!sortConfig) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "h:mm aa");
  };

  const formatBookingDate = (startTimeString) => {
    const date = new Date(startTimeString);
    return format(date, "dd MMM yyyy");
  };

  const getWeekDay = (startTimeString) => {
    const date = new Date(startTimeString);
    return format(date, "EEEE");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.info("Phone number copied to clipboard!");
    });
  };

  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="p-4 md:p-6 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary">
          Bookings Overview
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
          <select
            className="select select-primary w-full md:w-auto max-w-xs"
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={15}>Last 15 days</option>
            <option value={30}>Last 30 days</option>
          </select>

          <div className="stats shadow w-full md:w-auto">
            <div className="stat">
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-desc">From last {filterDays} days</div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to delete this booking?
              </p>
              <div className="modal-action">
                <button className="btn btn-error" onClick={deleteBooking}>
                  Delete
                </button>
                <button className="btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Turf</th>
                <th>User</th>
                <th>Phone</th>
                <th
                  onClick={() => requestSort("startTime")}
                  className="cursor-pointer hover:bg-base-200"
                >
                  Date{" "}
                  {getSortDirection("startTime") && (
                    <ArrowUpDown className="inline" size={16} />
                  )}
                </th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th
                  onClick={() => requestSort("totalPrice")}
                  className="cursor-pointer hover:bg-base-200"
                >
                  Price{" "}
                  {getSortDirection("totalPrice") && (
                    <ArrowUpDown size={16} className="inline" />
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover">
                  <td className="whitespace-nowrap">{booking.turfName}</td>
                  <td>
                    <div className="flex items-center space-x-3">
                      <Avatar name={booking.userName} size="32" round={true} />
                      <div className="md:block font-semibold">
                        {booking.userName}
                      </div>
                    </div>
                  </td>
                  <td
                    className="whitespace-nowrap cursor-pointer"
                    onClick={() => copyToClipboard(booking.phone)}
                  >
                    {booking.phone}
                  </td>
                  <td className="whitespace-nowrap">
                    <Calendar size={16} className="inline mr-1" />
                    {formatBookingDate(booking.startTime)}
                  </td>
                  <td className="whitespace-nowrap">
                    {getWeekDay(booking.startTime)}
                  </td>
                  <td className="whitespace-nowrap">
                    <Clock size={16} className="inline mr-1" />
                    {formatTime(booking.startTime)}
                  </td>
                  <td className="whitespace-nowrap">
                    <Clock size={16} className="inline mr-1" />
                    {formatTime(booking.endTime)}
                  </td>
                  <td>{booking.duration.toFixed(2)} hrs</td>
                  <td>
                    <span className="badge badge-accent badge-lg">
                      <IndianRupee size={16} className="inline mr-1" />
                      {booking.totalPrice}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => openModal(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-base-content opacity-70">
            Showing {bookings.length} bookings from the last {filterDays} days
          </div>

          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn btn-sm">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;
