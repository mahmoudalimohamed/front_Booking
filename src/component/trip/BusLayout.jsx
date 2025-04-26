// BusLayout.jsx
import React from "react";

const BusLayout = ({
  availableSeats,
  chosenSeats,
  unavailableSeats,
  toggleSeatSelection,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-b-2"></div>
      </div>
    );
  }

  if (availableSeats.length === 0) {
    return (
      <p className="text-gray-600 mb-4">No seats available for this trip.</p>
    );
  }

  const seatStyle = (seatNumber) => {
    if (unavailableSeats.includes(seatNumber))
      return "bg-red-500 text-white cursor-not-allowed";
    if (chosenSeats.includes(seatNumber)) return "bg-green-500 text-white";
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  const maxSeatNumber = Math.max(
    ...availableSeats.map((seat) => parseInt(seat.seat_number))
  );
  const totalRows = Math.ceil(maxSeatNumber / 4);
  const seatSize = totalRows > 10 ? "w-10 h-10" : "w-12 h-12";

  return (
    <div className="bus-layout mx-auto mb-8 font-mono">
      <div className="bus-body bg-gray-100 rounded-b-lg p-4">
        <div className="aisle-layout">
          {Array.from({ length: totalRows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-3 gap-10">
              <div className="flex gap-2">
                {[1, 2].map((seatPosition) => {
                  const seatNumber = rowIndex * 4 + seatPosition;
                  if (seatNumber <= maxSeatNumber) {
                    const seatExists = availableSeats.some(
                      (seat) => parseInt(seat.seat_number) === seatNumber
                    );

                    if (!seatExists)
                      return (
                        <div
                          key={seatNumber}
                          className={`${seatSize} invisible`}
                        >
                          {" "}
                        </div>
                      );

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => toggleSeatSelection(seatNumber)}
                        disabled={unavailableSeats.includes(seatNumber)}
                        className={`${seatSize} rounded-t-lg border-b-4 border-gray-700 flex flex-col items-center justify-center transition-colors ${seatStyle(
                          seatNumber
                        )}`}
                      >
                        <span className="font-bold">{seatNumber}</span>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="flex gap-2">
                {[3, 4].map((seatPosition) => {
                  const seatNumber = rowIndex * 4 + seatPosition;
                  if (seatNumber <= maxSeatNumber) {
                    const seatExists = availableSeats.some(
                      (seat) => parseInt(seat.seat_number) === seatNumber
                    );

                    if (!seatExists)
                      return (
                        <div
                          key={seatNumber}
                          className={`${seatSize} invisible`}
                        >
                          {" "}
                        </div>
                      );

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => toggleSeatSelection(seatNumber)}
                        disabled={unavailableSeats.includes(seatNumber)}
                        className={`${seatSize} rounded-t-lg border-b-4 border-gray-700 flex flex-col items-center justify-center transition-colors ${seatStyle(
                          seatNumber
                        )}`}
                      >
                        <span className="font-bold">{seatNumber}</span>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusLayout;
