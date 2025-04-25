import React from 'react';

const MiniBusLayout = ({ availableSeats, chosenSeats, unavailableSeats, toggleSeatSelection, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-b-2"></div>
      </div>
    );
  }

  if (availableSeats.length === 0) {
    return (<p className="text-gray-600 mb-4">No seats available for this trip.</p>);
  }

  // Define the layout pattern we want to achieve
  const layoutPattern = [
    { type: 'center', seats: 1 },                 // 1 seat in center
    { type: 'left-group', seats: 2 },             // 2 seats on left
    { type: 'left-right-group', seats: 3 },       // 2 seats on left, 1 on right
    { type: 'left-right-group', seats: 3 },       // 2 seats on left, 1 on right
    { type: 'full-row', seats: 4 }                // 4 seats in a row
  ];

  // Process seats
  const processedSeats = [...availableSeats].map(seat => 
    typeof seat === 'object' ? parseInt(seat.seat_number) : parseInt(seat) ).sort((a, b) => a - b);
  
  // Determine seat style based on its status
  const seatStyle = (seatNumber) => {
    if (unavailableSeats.includes(seatNumber)) return "bg-red-500 text-white cursor-not-allowed";
    if (chosenSeats.includes(seatNumber)) return "bg-green-500 text-white";
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  // Seat size styling
  const seatSize = "w-12 h-12";
  
  // Generate layout based on available seats
  const generateLayout = () => {
    const layout = [];
    let seatIndex = 0;
    
    // Map through our pattern and assign available seats
    for (const rowPattern of layoutPattern) {
      // Skip if we've used all seats
      if (seatIndex >= processedSeats.length) break;
      
      const rowSeats = [];
      for (let i = 0; i < rowPattern.seats && seatIndex < processedSeats.length; i++) {
        rowSeats.push(processedSeats[seatIndex]);
        seatIndex++;
      }
      
      if (rowSeats.length > 0) {
        layout.push({
          type: rowPattern.type,
          seats: rowSeats
        });
      }
    }
    
    // If we have additional seats that don't fit our pattern, 
    // add them as full rows of 4 (or fewer for the last row)
    while (seatIndex < processedSeats.length) {
      const rowSeats = [];
      for (let i = 0; i < 4 && seatIndex < processedSeats.length; i++) {
        rowSeats.push(processedSeats[seatIndex]);
        seatIndex++;
      }
      
      if (rowSeats.length > 0) {
        layout.push({
          type: 'full-row',
          seats: rowSeats
        });
      }
    }
    
    return layout;
  };
  
  const layout = generateLayout();
  
  // Render a single seat
  const renderSeat = (seatNumber) => {
    return (
      <button
        key={seatNumber}
        onClick={() => toggleSeatSelection(seatNumber)}
        disabled={unavailableSeats.includes(seatNumber)}
        className={`${seatSize} rounded-t-lg border-b-4 border-gray-700 flex flex-col items-center justify-center transition-colors ${seatStyle(seatNumber)}`}
      >
        <span className="font-bold">{seatNumber}</span>
      </button>
    );
  };

  return (
    <div className="mini-bus-layout mx-auto mb-1 max-w-md font-mono">
      {/* Bus body */}
      <div className="bus-body p-1 rounded-b-lg">
        {layout.map((row, rowIndex) => {
          if (row.type === 'center') {
            // One seat centered
            return (
              <div key={`row-${rowIndex}`} className="flex justify-center ml-38 mb-2">
                {renderSeat(row.seats[0])}
              </div>
            );
          } else if (row.type === 'left-group') {
            // Group of seats on the left
            return (
              <div key={`row-${rowIndex}`} className="flex mb-2">
                <div className="flex gap-2">
                  {row.seats.map(seatNumber => renderSeat(seatNumber))}
                </div>
              </div>
            );
          } else if (row.type === 'left-right-group') {
            // 2 seats on left, 1 on right
            return (
              <div key={`row-${rowIndex}`} className="flex gap-12 mb-2">
                <div className="flex gap-2 mr-1 ">
                  {row.seats.slice(0, 2).map(seatNumber => renderSeat(seatNumber))}
                </div>
                {row.seats.length > 2 && renderSeat(row.seats[2])}
              </div>
            );
          } else if (row.type === 'full-row') {
            // Seats spread evenly across
            return (
              <div key={`row-${rowIndex}`} className="flex gap-1  mb-2">
                {row.seats.map(seatNumber => renderSeat(seatNumber))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default MiniBusLayout;