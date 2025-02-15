import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";

const useOwnerBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDays, setFilterDays] = useState(30);
  const [sortConfig, setSortConfig] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/owner/bookings?page=${currentPage}&limit=${itemsPerPage}`);
      const { bookings, pagination } = response.data;
      setAllBookings(bookings);
      setTotalPages(pagination.totalPages);
      setLoading(false);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch bookings");
      }
      setLoading(false);
    }
  };

  const deleteBooking = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/api/owner/bookings/delete", {
        bookingId: selectedBookingId,
      });
      setLoading(false);

      toast.success("Booking deleted successfully");
      setIsModalOpen(false);
      fetchBookings(); // Refresh the bookings list after deletion
    } catch (error) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch bookings");
      }
      setLoading(false);
      toast.error("An error occurred while deleting the booking");
    }
  };

  const filteredBookings = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filterDays);
    return allBookings.filter(
      (booking) => new Date(booking.bookingDate) >= cutoffDate
    );
  }, [allBookings, filterDays]);

  const sortedBookings = useMemo(() => {
    let sortableBookings = [...filteredBookings];
    if (sortConfig !== null) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [filteredBookings, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Add pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    bookings: sortedBookings,
    loading,
    error,
    filterDays,
    setFilterDays,
    sortConfig,
    requestSort,
    fetchBookings,
    deleteBooking,
    isModalOpen,
    setIsModalOpen,
    setSelectedBookingId,
    selectedBookingId,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
};

export default useOwnerBookings;
