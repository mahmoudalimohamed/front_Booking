import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { userProfileApi, tripBookingApi, postTripBookingApi, confirmTripBookingApi, fetchPaymentKeyApi, redirectToPaymentApi } from "../../api/booking";
import BusLayout from "./BusLayout";
import MiniBusLayout from "./MiniBusLayout";

const TripBooking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tripInfo = location.state?.trip || null;

  const [availableSeats, setAvailableSeats] = useState([]);
  const [chosenSeats, setChosenSeats] = useState([]);
  const [unavailableSeats, setUnavailableSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("online");
  const [tempBookingRef, setTempBookingRef] = useState(null);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [userType, setUserType] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const loadUserType = useCallback(async () => {
    try {
      const { data } = await userProfileApi();
      setUserType(data.user.user_type);
    } catch (err) {
      setErrorMessage("Failed to fetch user type.");
      console.error("User type loading error:", err);
    }
  }, []);

  const loadSeats = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await tripBookingApi(tripId);
      const allSeats = Object.keys(data.seat_status || {}).map((seatNum) => ({
        seat_number: parseInt(seatNum),
        status: data.seat_status[seatNum],
      }));
      const bookedSeats = allSeats
        .filter((seat) => seat.status !== "available")
        .map((seat) => seat.seat_number);
      const sortedSeats = allSeats.sort(
        (a, b) => a.seat_number - b.seat_number
      );
      setAvailableSeats(sortedSeats);
      setUnavailableSeats(bookedSeats);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to fetch seats.");
      console.error("Seat loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadUserType();
    loadSeats();
  }, [loadUserType, loadSeats]);

  useEffect(() => {
    if (userType === "Admin") {
      setPaymentType("cash");
    } else if (userType === "Passenger") {
      setPaymentType("online");
    }
  }, [userType]);

  const toggleSeatSelection = (seatNumber) => {
    if (unavailableSeats.includes(seatNumber)) return;
    setChosenSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((num) => num !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const initiateBooking = async () => {
    if (chosenSeats.length === 0) {
      setErrorMessage("Please choose at least one seat.");
      return;
    }
    if (chosenSeats.length > 8) {
      setErrorMessage("Can't choose more than 8 seats.");
      return;
    }
    if (userType === "Admin" && (!customerName || !customerPhone)) {
      setErrorMessage(
        "Customer name and phone are required for admin bookings."
      );
      return;
    }

    setIsSubmitting(true);
    setIsProcessing(true);

    const bookingData = {
      seats_booked: chosenSeats.length,
      selected_seats: chosenSeats,
      payment_type: paymentType.toUpperCase(),
    };

    if (userType === "Admin") {
      bookingData.customer_name = customerName; 
      bookingData.customer_phone = customerPhone; 
    }

    try {
      const response = await postTripBookingApi(tripId, bookingData);
      setTempBookingRef(response.data.temp_booking_ref);
      setShowProcessingOverlay(true);
      setErrorMessage("");
    } catch (err) {
      handleBookingError(err);
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  };

  const confirmBooking = async () => {
    if (!tempBookingRef) return;

    setIsProcessing(true);
    setIsConfirmed(true);

    try {
      const confirmationData = {
        temp_booking_ref: tempBookingRef,
      };

      if (userType === "Admin") {
        confirmationData.customer_name = customerName;
        confirmationData.customer_phone = customerPhone;
      }

      const response = await confirmTripBookingApi(
        tripId,
        tempBookingRef,
        confirmationData
      ); 
      const { order_id, booking, redirect_url } = response.data;
      setBookingData({ order_id, booking, redirect_url });
      setShowProcessingOverlay(false);

      if (paymentType === "online" && order_id) {
        const paymentResponse = await fetchPaymentKeyApi(order_id); 
        const paymentData = paymentResponse.data;
        const paymentKey = paymentData.payment_key;
        if (!paymentKey) throw new Error("Invalid payment key received");
        setBookingData((prev) => ({ ...prev, paymentKey }));
        redirectToPaymentApi(paymentKey);
      } else {
        if (redirect_url) {
          window.location.href = redirect_url;
        } else {
          navigate("/booking-success");
        }
      }
    } catch (err) {
      handleBookingError(err);
      setIsConfirmed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = () => {
    setShowProcessingOverlay(false);
    setTempBookingRef(null);
    setBookingData(null);
    setIsProcessing(false);
    setIsConfirmed(false);
    setErrorMessage("");
  };

  const handleBookingError = (err) => {
    if (err.response?.data?.error?.includes("Seat")) {
      setErrorMessage(err.response.data.error);
      loadSeats();
    } else {
      setErrorMessage(
        err.response?.data?.error || err.message || "Failed to process booking"
      );
      console.error("Booking error:", err);
    }
    setShowProcessingOverlay(false);
    setIsConfirmed(false);
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalCost = () => chosenSeats.length * (tripInfo?.price || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-sans">
      {/* Booking Confirmation Modal */}
      {showProcessingOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#A62C2C] text-white p-4">
              <h3 className="text-xl font-bold text-center">
                Confirm Your Booking
              </h3>
            </div>
            
            <div className="p-6">
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
                <p className="text-[#A62C2C] text-sm font-medium text-center">
                  IMPORTANT: Please verify all details carefully.
                  Once confirmed, booking cannot be refunded or changed.
                </p>
              </div>
              
              <div className="space-y-4 font-mono">
                <div className="border-b pb-3 bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono">
                  <h4 className="text-lg font-mono bg-[#A62C2C] text-white hover:bg-[#8B2525] mb-2">
                    Trip Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">From</span>
                      <span className="font-mono">{tripInfo?.start_location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">To</span>
                      <span className="font-mono">{tripInfo?.destination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">Date</span>
                      <span className="font-mono">{formatTime(tripInfo?.departure_date)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">Bus Type</span>
                      <span className="font-mono">{tripInfo?.bus_type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-mono text-[#A62C2C] mb-2">
                    Booking Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">Selected Seats</span>
                      <span className="font-mono">{chosenSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">Total Amount</span>
                      <span className="font-mono">{totalCost().toFixed(2)} EGP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#A62C2C]">Payment Method</span>
                      <span className="font-mono">{paymentType === "online" ? "Visa" : "Cash"}</span>
                    </div>
                    
                    {userType === "Admin" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[#A62C2C]">Customer Name</span>
                          <span className="font-mono">{customerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[#A62C2C]">Customer Phone</span>
                          <span className="font-mono">{customerPhone}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={confirmBooking}
                  disabled={isProcessing || isConfirmed}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={isConfirmed}
                  className="flex-1 bg-[#A62C2C] hover:bg-[#A62C2C] text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Trip Info Card */}
        {tripInfo && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 font-mono">
            <div className="bg-[#A62C2C] text-white p-4">
              <h2 className="text-xl font-bold">Trip Details</h2>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-[#A62C2C]">Route</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-900">{tripInfo.start_location}</span>
                  </div>
                  <div className="border-l-2 border-dashed border-gray-300 h-6 ml-1.5"></div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-900">{tripInfo.destination}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-[#A62C2C]">Departure</p>
                <p className="font-medium text-gray-900">{formatTime(tripInfo.departure_date)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-[#A62C2C]">Bus Type</p>
                <p className="font-medium text-gray-900">{tripInfo.bus_type}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-[#A62C2C]">Price Per Seat</p>
                <p className="font-medium text-gray-900">{tripInfo.price} EGP</p>
              </div>
            </div>
          </div>
        )}

        {/* Seat Selection Section */}
                <div className="justify-self-center justify-center">
                  {tripInfo?.bus_type === "MINI" ? (
                    <MiniBusLayout
                      availableSeats={availableSeats}
                      chosenSeats={chosenSeats}
                      unavailableSeats={unavailableSeats}
                      toggleSeatSelection={toggleSeatSelection}
                      loading={loading}
                    />
                  ) : (
                    <BusLayout
                      availableSeats={availableSeats}
                      chosenSeats={chosenSeats}
                      unavailableSeats={unavailableSeats}
                      toggleSeatSelection={toggleSeatSelection}
                      loading={loading}
                    />
                  )}
                </div>

        {/* Customer Details Section (Admin only) */}
        {userType === "Admin" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-[#A62C2C] text-white p-4">
              <h2 className="text-xl font-bold">Customer Details</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter customer name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  Customer Phone
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter customer phone (11 digits)"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment and Booking Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden font-mono">
          <div className="bg-[#A62C2C] text-white hover:bg-[#8B2525] p-4">
            <h2 className="text-xl font-bold">Payment Details</h2>
          </div>
          
          <div className="p-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-[#A62C2C] p-3 rounded-lg mb-4">
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <p className="text-sm text-[#A62C2C] mb-1">Total Price</p>
                <p className="text-2xl font-bold text-[#A62C2C]">{totalCost().toFixed(2)} EGP</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  Payment Method
                </label>
                <div className="text-2xl font-bold text-[#A62C2C]">
                  {userType === "Admin" ? "Cash" : "Visa"}
                </div>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={initiateBooking}
                  disabled={isSubmitting || chosenSeats.length === 0}
                  className="w-full md:w-auto px-6 py-3 bg-[#A62C2C] text-white hover:bg-[#8B2525] font-medium rounded-lg transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Book Seats"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripBooking;