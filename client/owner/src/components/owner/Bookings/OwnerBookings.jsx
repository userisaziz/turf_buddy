import React, { useState } from "react";
import useOwnerBookings from "@hooks/owner/useOwnerBookings";
import BookingsSkeleton from "./BookingsSkeleton";
import { format } from "date-fns";
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Trash2,
  Phone
} from "lucide-react";
import Avatar from "react-avatar";

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

  const [copiedId, setCopiedId] = useState(null);

  // --- Helpers ---

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSortDirection = (name) => {
    if (!sortConfig) return undefined;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  // --- Sub-components ---

  const SortableHeader = ({ label, field, currentSortConfig, onSort }) => {
    const isSorted = currentSortConfig?.key === field;
    const direction = isSorted ? currentSortConfig.direction : undefined;

    return (
      <th
        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1 group">
          {label}
          <span className="text-gray-400 group-hover:text-gray-600">
            {isSorted ? (
              direction === "ascending" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            ) : (
              <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />
            )}
          </span>
        </div>
      </th>
    );
  };

  if (loading) return <BookingsSkeleton />;
  if (error) return <div className="alert alert-error shadow-lg max-w-7xl mx-auto mt-6">{error}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Manage current and past reservations</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
             <span className="text-sm text-gray-500 pl-2">Filter:</span>
             <select
              className="select select-sm select-ghost w-full max-w-xs focus:bg-transparent"
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={15}>Last 15 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            <span className="text-sm font-semibold text-gray-700 pr-2">
              {bookings.length} Bookings
            </span>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="modal modal-open z-50">
            <div className="modal-box bg-white border border-gray-100 shadow-2xl">
              <h3 className="font-bold text-lg text-gray-800">Confirm Deletion</h3>
              <p className="py-4 text-gray-600">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="modal-action">
                <button 
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors" 
                  onClick={deleteBooking}
                >
                  Delete
                </button>
                <button 
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="modal-backdrop bg-black/20" onClick={closeModal}></div>
          </div>
        )}

        {/* Main Table Card */}
        <div className="w-full bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Turf & User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  
                  <SortableHeader
                    label="Date"
                    field="startTime"
                    currentSortConfig={sortConfig}
                    onSort={requestSort}
                  />

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Timing
                  </th>
                  
                  <SortableHeader
                    label="Price"
                    field="totalPrice"
                    currentSortConfig={sortConfig}
                    onSort={requestSort}
                  />

                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out group"
                  >
                    {/* Turf & User Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          {booking.turfName}
                        </span>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <Avatar name={booking.userName} size="32" round={true} className="shadow-sm" textSizeRatio={2} />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 font-mono border border-gray-200 flex items-center gap-1">
                          <Phone size={10} className="text-gray-400"/>
                          {booking.phone}
                        </span>
                        <button
                          onClick={() => handleCopy(booking.phone, booking.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                          title="Copy Phone"
                        >
                          {copiedId === booking.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <Calendar size={14} className="mr-1.5 text-gray-400"/>
                          {format(new Date(booking.startTime), "dd MMM yyyy")}
                        </div>
                        <div className="text-xs text-gray-500 pl-5 mt-0.5">
                          {format(new Date(booking.startTime), "EEEE")}
                        </div>
                      </div>
                    </td>

                    {/* Timing Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-700">
                           <Clock size={14} className="mr-1.5 text-gray-400"/>
                           {format(new Date(booking.startTime), "h:mm aa")} - {format(new Date(booking.endTime), "h:mm aa")}
                        </div>
                        <span className="text-xs text-gray-400 pl-5">
                          {booking.duration.toFixed(1)} hrs
                        </span>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                        ₹{booking.totalPrice}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => openModal(booking.id)}
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="text-gray-500 text-sm mt-1">Adjust your filters or wait for new reservations.</p>
            </div>
          )}

          {/* Footer / Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;