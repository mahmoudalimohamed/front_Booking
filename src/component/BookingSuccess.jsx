import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BookingSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');
  const success = queryParams.get('success')?.toLowerCase() === 'true';

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/bookings/detail/${orderId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Booking Details Fetched from Backend:", response.data);
        setBookingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [orderId]);

  const downloadTicketAsPDF = async () => {
    if (!booking) return;

    const ticketElement = document.getElementById('ticket-to-print');
    if (!ticketElement) return;

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get the dimensions of the PDF page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Create canvas from the HTML element
      const canvas = await html2canvas(ticketElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Calculate the width and height of the canvas to fit in PDF
      const imgWidth = pageWidth - 20; // Margin of 10mm on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`ticket-${booking.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to the simplified PDF if HTML to canvas fails
      generateSimplePDF();
    }
  };

  // Fallback method if html2canvas fails
  const generateSimplePDF = () => {
    if (!booking) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Add header
    pdf.setFillColor(166, 44, 44); // #A62C2C
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text("BUS BOOKING", margin, 15);
    
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text("BOARDING PASS", pageWidth - margin, 10, { align: 'right' });
    pdf.setFontSize(16);
    pdf.text(booking.payment_status || "PAID", pageWidth - margin, 20, { align: 'right' });
    
    // Journey route
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text(booking.trip.start_location, margin, yPosition);
    
    pdf.setTextColor(0, 0, 0);
    pdf.text(booking.trip.destination, pageWidth - margin, yPosition, { align: 'right' });
    
    yPosition += 15;
    
    // Column 1 - Left side
    const leftCol = margin;
    const rightCol = pageWidth / 2 + 5;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Passenger Name", leftCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(booking.customer_name || "N/A", leftCol, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Phone", leftCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(booking.customer_phone || "N/A", leftCol, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Departure", leftCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatDate(booking.trip.departure_date), leftCol, yPosition);
    
    // Reset Y position for right column
    yPosition = 45;
    
    // Column 2 - Right side
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Bus Type", rightCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(booking.trip.bus_type, rightCol, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Seat Numbers", rightCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(booking.selected_seats.join(", "), rightCol, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Total Amount", rightCol, yPosition);
    yPosition += 7;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${booking.total_price} EGP`, rightCol, yPosition);
    
    // Set y position for the divider
    yPosition = 120;
    
    // Add dotted separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 15;
    
    // Payment details in two columns
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    // Column 1
    pdf.text("Payment Ref:", leftCol, yPosition);
    pdf.setTextColor(50, 50, 50);
    pdf.text(booking.payment_reference || "N/A", leftCol + 25, yPosition);
    yPosition += 8;
    
    pdf.setTextColor(100, 100, 100);
    pdf.text("Payment Type:", leftCol, yPosition);
    pdf.setTextColor(50, 50, 50);
    pdf.text(booking.payment_type || "N/A", leftCol + 25, yPosition);
    
    // Reset Y position for right column footer
    yPosition = 135;
    
    // Column 2
    pdf.setTextColor(100, 100, 100);
    pdf.text("Payment Date:", rightCol, yPosition);
    pdf.setTextColor(50, 50, 50);
    pdf.text(booking.booking_date ? formatDate(booking.booking_date) : "N/A", rightCol + 25, yPosition);
    yPosition += 8;
    
    pdf.setTextColor(100, 100, 100);
    pdf.text("Issued:", rightCol, yPosition);
    pdf.setTextColor(50, 50, 50);
    pdf.text(new Date().toLocaleDateString(), rightCol + 25, yPosition);
    
    // Save the PDF
    pdf.save(`ticket-${booking.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-mono ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-b-2"></div>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className=" font-mono min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-700 font-medium">{error || "Payment was not successful. Please try again."}</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-[#A62C2C] text-white py-2 px-4 rounded-lg  hover:bg-[#8B2525] transition duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display ticket details
  const { booking } = bookingData || {};

  // Log booking data for debugging
  console.log("Booking Data:", bookingData);
  console.log("Customer Name:", booking?.customer_name);
  console.log("Customer Phone:", booking?.customer_phone);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Payment successful! Your ticket is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Printable Ticket */}
        <div id="ticket-to-print" className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-200">
          {/* Ticket Header */}
          <div className="bg-[#A62C2C] text-white px-6 py-4 relative">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">BUS BOOKING</h1>
              <div className="text-right">
                <p className="text-sm opacity-80">BOARDING PASS</p>
                <p className="text-xl font-bold">{booking?.payment_status}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Journey Headline */}
            <div className="flex justify-between items-center mb-6 text-xl font-bold">
              <div>{booking?.trip.start_location}</div>
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>{booking?.trip.destination}</div>
            </div>

            {/* Main ticket information */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Passenger Name</p>
                  <p className="font-bold text-lg">{booking?.customer_name || "N/A"}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{booking?.customer_phone || "N/A"}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">{booking?.trip.departure_date && formatDate(booking.trip.departure_date)}</p>
                </div>
              </div>
              
              {/* Right column */}
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Bus Type</p>
                  <p className="font-bold">{booking?.trip.bus_type}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Seat Numbers</p>
                  <p className="font-medium">
                    {booking?.selected_seats.join(", ")}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">{booking?.total_price} EGP</p>
                </div>
              </div>
            </div>

            {/* Dotted separator */}
            <div className="border-t border-dashed border-gray-300 my-6"></div>

            {/* Footer information - Changed to two columns */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><span className="font-medium">Payment Ref:</span> {booking?.payment_reference || 'N/A'}</p>
                <p><span className="font-medium">Payment Type:</span> {booking?.payment_type || 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">Payment Date:</span> {booking?.booking_date && formatDate(booking.booking_date)}</p>
                <p><span className="font-medium">Issued:</span> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={downloadTicketAsPDF}
            className="py-2 px-6 bg-[#A62C2C] text-white hover:bg-[#8B2525] transition duration-300 font-medium shadow-md rounded-full flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download Ticket
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-2 px-6 bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 font-medium shadow-md rounded-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;