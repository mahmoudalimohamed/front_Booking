import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelBookingApi, fetchProfileApi } from '../../api/booking';

// Status badge styling with modern design
const getStatusStyles = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
  }
};

const Profile = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // React Query for fetching profile data
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', page],
    queryFn: () => fetchProfileApi(page).then((res) => res.data),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Booking #${bookingId}? This action cannot be undone.`
    );
    if (!confirmCancel) return;

    // Set loading state for the specific booking
    queryClient.setQueryData(['profile', page], (oldData) => {
      if (!oldData) return oldData;

      const updatedBookings = oldData.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, isCancelling: true } : booking
      );

      return {
        ...oldData,
        bookings: updatedBookings,
      };
    });

    try {
      await cancelBookingApi(bookingId);

      // Update the cached data for the 'profile' query
      queryClient.setQueryData(['profile', page], (oldData) => {
        if (!oldData) return oldData;

        const updatedBookings = oldData.bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'CANCELLED', isCancelling: false }
            : booking
        );

        return {
          ...oldData,
          bookings: updatedBookings,
        };
      });

      // Use toast notification instead of alert for better UX
      // This assumes you have a toast library, replace with your preferred solution
      // toast.success(`Booking #${bookingId} cancelled successfully!`);
      alert(`Booking #${bookingId} cancelled successfully!`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');

      // Reset the loading state in case of an error
      queryClient.setQueryData(['profile', page], (oldData) => {
        if (!oldData) return oldData;

        const updatedBookings = oldData.bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, isCancelling: false } : booking
        );

        return {
          ...oldData,
          bookings: updatedBookings,
        };
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= profileData.pagination.total_pages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#A62C2C]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 max-w-sm mx-auto shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-red-600 font-medium text-center mb-4">
            {error.message || 'Failed to load profile'}
          </p>
          <button
            onClick={() => refetch()}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile App Bar - Only visible on mobile */}
      <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button className="p-1" onClick={() => navigate('/')}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
          </div>
          <button className="p-1">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Desktop Header - Only visible on desktop */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <div className="h-1 w-20 bg-[#A62C2C] mt-2"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="h-24 md:h-32 bg-gradient-to-r from-[#A62C2C] to-[#8B2525]"></div>
          <div className="relative px-4 md:px-8 pb-5 md:pb-8">
            {/* Profile Avatar */}
            <div className="absolute -top-10 md:-top-12 left-4 md:left-8">
              <div className="rounded-full shadow-lg bg-white p-1">
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-[#A62C2C] text-white text-2xl md:text-3xl font-bold">
                  {profile.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="mt-12 md:ml-36 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{profile.user.name}</h2>
                  
                  {/* User Badge */}
                  {profile.user.user_type && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                      {profile.user.user_type}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mt-4 space-y-2 md:space-y-0 md:flex md:space-x-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-[#A62C2C] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-sm">{profile.user.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-[#A62C2C] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-sm">{profile.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-[#A62C2C] px-1">My Bookings</h3>
        </div>

        {profile.bookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {profile.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg"
                >
                  {/* Trip header with gradient */}
                  <div className="bg-gradient-to-r from-[#A62C2C] to-[#8B2525] px-4 py-3 text-white rounded-t-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                        </svg>
                        <div>
                          <div className="font-bold">{booking.trip.start_location.name} → {booking.trip.destination.name}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Trip details */}
                  <div className="p-4">
                    <div className="flex items-center mb-4 text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm">
                        {new Date(booking.trip.departure_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="mx-2">•</span>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm">
                        {new Date(booking.trip.departure_date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Trip information in grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Seats</p>
                        <p className="font-medium text-gray-800">{booking.selected_seats.join(", ")}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Bus Type</p>
                        <p className="font-medium text-gray-800 capitalize">{booking.trip.bus_type.toLowerCase()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Total Price</p>
                        <p className="font-medium text-gray-800">{booking.total_price} EGP</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Payment</p>
                        <p className="font-medium text-gray-800 capitalize">{booking.payment_type.toLowerCase()}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-3 space-y-2 sm:space-y-0">
                      <button
                        onClick={() => navigate(`/booking-success?order_id=${booking.id}&success=true`)}
                        className="w-full py-2.5 px-4 bg-indigo-50 text-indigo-700 rounded-lg font-medium flex items-center justify-center hover:bg-indigo-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Ticket
                      </button>

                      {profile.user.user_type === "Admin" && booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={booking.isCancelling}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center transition ${
                            booking.isCancelling
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {booking.isCancelling ? (
                            <>
                              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 8v4m4-4h4m-8 0H4"></path>
                              </svg>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                              Cancel Booking
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center items-center mt-6 mb-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous
              </button>

              <div className="bg-[#A62C2C] text-white font-medium px-4 py-2 mx-3 rounded-lg">
                Page {page} of {profile.pagination.total_pages}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === profile.pagination.total_pages}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  page === profile.pagination.total_pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Next
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-lg mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate("/")}
              className="w-full md:w-auto md:px-8 bg-[#A62C2C] hover:bg-[#8B2525] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              Browse Available Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;