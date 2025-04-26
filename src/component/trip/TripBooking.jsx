import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BusLayout from "./BusLayout";
import MiniBusLayout from "./MiniBusLayout";
import {
  userProfileApi,
  tripBookingApi,
  postTripBookingApi,
  confirmTripBookingApi,
  fetchPaymentKeyApi,
  redirectToPaymentApi,
} from "../../api/booking";

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
      console.log("User Type:", data.user.user_type);
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

    // Log the bookingData object here
    console.log("Booking Data Sent to Backend:", bookingData);

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

      console.log("Confirmation Data Sent to Backend:", confirmationData);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-mono">
      {showProcessingOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-full mb-4 p-3 bg-red-50 border border-[#A62C2C] rounded-lg">
                <p className="text-red-600 text-lg font-medium text-center">
                  IMPORTANT <br /> Please Verify All Details Carefully.
                  <br /> Once Confirmed Booking Cannot Be Refunded Or Changed.
                </p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg w-full border border-gray-100 mb-4">
                <div className="space-y-3">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-lg font-semibold text-[#A62C2C] mb-2">
                      Trip Details
                    </h4>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">From</span>
                      <span className="text-gray-900">
                        {tripInfo?.start_location}
                      </span>
                    </p>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">To</span>
                      <span className="text-gray-900">
                        {tripInfo?.destination}
                      </span>
                    </p>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">Date</span>
                      <span className="text-gray-900">
                        {formatTime(tripInfo?.departure_date)}
                      </span>
                    </p>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">Bus Type</span>
                      <span className="text-gray-900">
                        {tripInfo?.bus_type}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#A62C2C] mb-2">
                      Booking Details
                    </h4>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">Selected Seats</span>
                      <span className="text-gray-900">
                        {chosenSeats.join(", ")}
                      </span>
                    </p>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-gray-900">
                        {totalCost().toFixed(2)} EGP
                      </span>
                    </p>
                    <p className="text-lg text-[#A62C2C] flex justify-between">
                      <span className="font-medium">Payment Method</span>
                      <span className="text-gray-900">
                        {paymentType === "online" ? "Visa" : "Cash"}
                      </span>
                    </p>
                    {userType === "Admin" && (
                      <>
                        <p className="text-lg text-[#A62C2C] flex justify-between">
                          <span className="font-medium">Customer Name</span>
                          <span className="text-gray-900">{customerName}</span>
                        </p>
                        <p className="text-lg text-[#A62C2C] flex justify-between">
                          <span className="font-medium">Customer Phone</span>
                          <span className="text-gray-900">{customerPhone}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={confirmBooking}
                disabled={isProcessing || isConfirmed}
                className="rounded-full bg-green-500 hover:bg-green-600 text-white px-8 py-2 text-lg font-medium transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isConfirmed}
                className="mt-3 rounded-full bg-red-500 hover:bg-red-600 text-white px-8 py-2 text-lg font-medium transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#A62C2C] mb-4">
          Select Your Seats
        </h2>
        {tripInfo && (
          <div className="p-6 flex flex-col md:flex-row justify-between justify-items-center">
            <div className="flex-1 justify-items-center">
              <div className="text-lg text-[#A62C2C] mb-1">From & To</div>
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">
                  {tripInfo.start_location}
                </span>
              </div>
              <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1"></div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900">
                  {tripInfo.destination}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="text-lg text-[#A62C2C] mb-1">Departure Date</div>
              <div className="font-medium">
                {formatTime(tripInfo.departure_date)}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="text-lg text-[#A62C2C] mb-1">Bus Type</div>
              <div className="font-medium">{tripInfo.bus_type}</div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="text-lg text-[#A62C2C] mb-1">Seat Price</div>
              <div className="font-medium">{tripInfo.price} EGP</div>
            </div>
          </div>
        )}
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
        <br />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {userType === "Admin" && (
          <div className="mb-4">
            <label className="block text-lg text-[#A62C2C] mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-[#A62C2C] rounded-lg px-4 py-3 text-[#A62C2C] focus:ring-2 focus:ring-[#A62C2C] focus:outline-none transition duration-200 shadow-sm text-lg w-full"
              placeholder="Enter customer name"
              disabled={isSubmitting}
            />
            <label className="block text-lg text-[#A62C2C] mt-2 mb-1">
              Customer Phone
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border-[#A62C2C] rounded-lg px-4 py-3 text-[#A62C2C] focus:ring-2 focus:ring-[#A62C2C] focus:outline-none transition duration-200 shadow-sm text-lg w-full"
              placeholder="Enter customer phone (11 digits)"
              disabled={isSubmitting}
            />
          </div>
        )}
        <div className="flex justify-between items-center justify-items-center mt-4">
          <h2 className="text-lg font-semibold text-[#A62C2C]">
            Total Price: {totalCost().toFixed(2)} EGP
          </h2>
          <div className="mb-4">
            <label className="mr-4 text-lg text-[#A62C2C]">
              Select Payment Method
            </label>
            {userType === "Admin" ? (
              <span className="border-[#A62C2C] rounded-lg px-4 py-3 text-[#A62C2C] text-lg">
                Cash
              </span>
            ) : (
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="border-[#A62C2C] rounded-lg px-4 py-3 text-[#A62C2C] focus:ring-2 focus:ring-[#A62C2C] focus:outline-none transition duration-200 shadow-sm text-lg"
                disabled={isSubmitting}
              >
                <option value="online">Visa</option>
              </select>
            )}
          </div>
          <div className="space-x-4">
            <button
              onClick={initiateBooking}
              disabled={isSubmitting}
              className={`px-6 py-2 text-lg rounded-full transition ${
                isSubmitting
                  ? "bg-[#A62C2C] text-white hover:bg-[#8B2525] cursor-not-allowed"
                  : "bg-[#A62C2C] text-white hover:bg-[#8B2525]"
              }`}
            >
              {isSubmitting ? "Processing..." : "Book Seats"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TripBooking;
