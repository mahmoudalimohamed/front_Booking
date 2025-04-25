import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    total_pages: 1,
  });
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [page]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.get(
        `http://localhost:8000/api/profile/?page=${page}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setFormData(response.data.user);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Booking #${bookingId}? This action cannot be undone.`
    );
    if (!confirmCancel) {
      return; // Exit if user cancels the confirmation
    }

    setIsCancelLoading(true);
    setCancelError(null);
    setCancelSuccess(null);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setCancelSuccess(`Booking #${bookingId} cancelled successfully!`);
        // Refresh profile data to reflect cancellation
        fetchProfile();
      }
    } catch (err) {
      if (err.response) {
        setCancelError(err.response.data.error || "Failed to cancel booking");
      } else {
        setCancelError("Network error. Please try again.");
      }
    } finally {
      setIsCancelLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#A62C2C]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 font-mono">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-red-600 font-medium text-lg mb-2">{error}</p>
          <button 
            onClick={() => fetchProfile()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const getStatusStyles = (status) => {
    switch(status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-mono">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header with Profile Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-24 bg-gradient-to-r from-[#A62C2C] to-[#8B2525]"></div>
          <div className="relative px-6 py-8">
            <div className="absolute -top-12 left-8">
              <div className="bg-white rounded-full p-1 shadow-lg">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center bg-[#A62C2C] text-white hover:bg-[#8B2525] text-3xl font-bold transition-colors">
                  {profile.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="ml-36">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {profile.user.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#A62C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>{profile.user.phone_number}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#A62C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>{profile.user.email}</span>
                </div>
                {profile.user.user_type && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#A62C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {profile.user.user_type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {cancelSuccess && (
          <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            {cancelSuccess}
          </div>
        )}
        
        {cancelError && (
          <div className="bg-red-100 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {cancelError}
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#A62C2C] ju">My Bookings</h2>
            
            </div>
          </div>

          <div className="p-6">
            {profile.bookings.length > 0 ? (
              <>
                <div className="grid gap-6">
                  {profile.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-300 bg-white"
                    >
                      <div className="flex flex-col lg:flex-row justify-between">
                        <div className="mb-6 lg:mb-0">
                          <div className="flex items-center mb-4">
                            <div className="bg-[#A62C2C] bg-opacity-10 p-3 rounded-full mr-4">
                              <svg
                                className="w-6 h-6 text-[#A62C2C]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                ></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {booking.trip.start_location.name} 
                                <span className="mx-3 text-gray-400">→</span>
                                {booking.trip.destination.name}
                              </h3>
                              <div className="flex items-center mt-1 text-gray-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {new Date(booking.trip.departure_date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                                <span className="mx-2">•</span>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {new Date(booking.trip.departure_date).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Seats</p>
                              <p className="font-medium text-gray-800">{booking.selected_seats.join(", ")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Bus Type</p>
                              <p className="font-medium text-gray-800 capitalize">{booking.trip.bus_type.toLowerCase()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Total Price</p>
                              <p className="font-medium text-gray-800">{booking.total_price} EGP</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Payment</p>
                              <p className="font-medium text-gray-800 capitalize">{booking.payment_type.toLowerCase()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end justify-between">
                          <div className="flex flex-col md:items-end mb-4">
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="flex flex-col md:items-end space-y-3">
                            <button
                              onClick={() => navigate(`/booking-success?order_id=${booking.id}&success=true`)}
                              className="text-sm text-[#A62C2C] hover:text-[#8B2525] hover:underline flex items-center transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Download Ticket
                            </button>
                            
                            {profile.user.user_type === "Admin" && booking.status !== "CANCELLED" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={isCancelLoading}
                                className="py-2 px-4 bg-red-600 text-white hover:bg-red-700 transition duration-300 font-medium shadow-sm rounded-lg flex items-center justify-center"
                              >
                                {isCancelLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-8">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center px-4 py-2 mx-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                    Previous
                  </button>

                  <div className="px-4 py-2 mx-1 bg-[#A62C2C] bg-opacity-10 border border-[#A62C2C] border-opacity-20 rounded-lg text-white font-medium">
                    Page {page} of {pagination.total_pages}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.total_pages}
                    className="flex items-center px-4 py-2 mx-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gray-100 rounded-full p-6 mb-6">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6 text-center">You haven't made any bookings yet.</p>
                <button 
                  onClick={() => navigate('/trips')}
                  className="bg-[#A62C2C] hover:bg-[#8B2525] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                  </svg>
                  Browse Available Trips
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;