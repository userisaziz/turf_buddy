import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";
import { parseISO, compareAsc, compareDesc } from "date-fns";
import toast from "react-hot-toast";

const useOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDays, setFilterDays] = useState(7);
  const [sortConfig, setSortConfig] = useState({
    key: "startTime",
    direction: "descending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/owner/bookings?days=${filterDays}`
      );
      let fetchedBookings = response.data.bookings;

      // Sort bookings by default
      fetchedBookings = sortBookings(fetchedBookings, sortConfig);

      setBookings(fetchedBookings);
      setTotalPages(Math.ceil(fetchedBookings.length / ITEMS_PER_PAGE));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortBookings = (bookingsToSort, config) => {
    return [...bookingsToSort].sort((a, b) => {
      if (config.key === "startTime" || config.key === "endTime") {
        const dateA = parseISO(a[config.key]);
        const dateB = parseISO(b[config.key]);
        return config.direction === "ascending"
          ? compareAsc(dateA, dateB)
          : compareDesc(dateA, dateB);
      }

      if (config.key === "totalPrice" || config.key === "duration") {
        return config.direction === "ascending"
          ? a[config.key] - b[config.key]
          : b[config.key] - a[config.key];
      }

      // Default string comparison for other fields
      return config.direction === "ascending"
        ? a[config.key]?.localeCompare(b[config.key])
        : b[config.key]?.localeCompare(a[config.key]);
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setBookings(sortBookings(bookings, { key, direction }));
  };

  const deleteBooking = async () => {
    if (!selectedBookingId) return;

    try {
      await axiosInstance.post(`/api/owner/bookings/delete`, {
        bookingId: selectedBookingId,
      });

      setBookings(
        bookings.filter((booking) => booking.id !== selectedBookingId)
      );
      setIsModalOpen(false);
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterDays]);

  // Get paginated bookings
  const getPaginatedBookings = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return bookings.slice(startIndex, endIndex);
  };

  return {
    bookings: getPaginatedBookings(),
    loading,
    error,
    filterDays,
    setFilterDays,
    sortConfig,
    deleteBooking,
    isModalOpen,
    setIsModalOpen,
    setSelectedBookingId,
    selectedBookingId,
    requestSort,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
};

export default useOwnerBookings;
