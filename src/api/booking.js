import axios from "axios";

//function to get headers with the token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return { Authorization: `Bearer ${token}` };
};


export const locationsyApi = async () => {
  return axios.get("https://mahmoudali0.pythonanywhere.com/api/locations/");
};


export const tripSearchApi = async (params) => {
  return axios.get("https://mahmoudali0.pythonanywhere.com/api/trips/search/", { params });
};


export const userProfileApi = async () => {
  return axios.get("https://mahmoudali0.pythonanywhere.com/api/profile/", {
    headers: getAuthHeaders(),
  });
};


export const tripBookingApi = async (tripId) => {
  return axios.get(`https://mahmoudali0.pythonanywhere.com/api/trips/${tripId}/book/`, {
    headers: getAuthHeaders(),
  });
};


export const postTripBookingApi = async (tripId, bookingData) => {
  return axios.post(
    `https://mahmoudali0.pythonanywhere.com/api/trips/${tripId}/book/`,
    bookingData,
    {
      headers: getAuthHeaders(),
    }
  );
};


export const confirmTripBookingApi = async (
  tripId,
  tempBookingRef,
  confirmationData
) => {
  return axios.post(
    `https://mahmoudali0.pythonanywhere.com/api/trips/${tripId}/confirm/${tempBookingRef}/`,
    confirmationData,
    { headers: getAuthHeaders() }
  );
};


export const fetchPaymentKeyApi = async (orderId) => {
  return axios.get(`https://mahmoudali0.pythonanywhere.com/api/get_payment_key/${orderId}/`, {
    headers: getAuthHeaders(),
  });
};


export const redirectToPaymentApi = (paymentKey) => {
  const url = `https://accept.paymob.com/api/acceptance/iframes/908347?payment_token=${paymentKey}`;
  window.location.href = url;
};


export const bookingDetailApi = async (orderId) => {
  return axios.get(`https://mahmoudali0.pythonanywhere.com/api/bookings/detail/${orderId}/`, {
    headers: getAuthHeaders(),
  });
};


export const cancelBookingApi = async (bookingId) => {
  return axios.post(
    `https://mahmoudali0.pythonanywhere.com/api/bookings/${bookingId}/cancel/`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};


export const fetchProfileApi = async (page) => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("No access token found");
  }
  return axios.get(`http://localhost:8000/api/profile/?page=${page}&limit=5`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
