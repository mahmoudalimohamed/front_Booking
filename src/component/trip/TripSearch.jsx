import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import cover from '../../assets/cover.png';
import { locationsyApi, tripSearchApi } from '../../api/booking';

const TripSearch = () => {

  const [formData, setFormData] = useState({ start_area: '', destination_area: '', departure_date: '', round_trip: false});
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  // Fetch cities and areas on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationsyApi();
        setCities(response.data.cities || []);
        setError(null);
      } 
      catch (err) { setError('Error fetching locations. Please try again.'); console.error(err);} 
      finally { setIsLoading(false);}
    };
    fetchLocations(); }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setSearchPerformed(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchPerformed(false);

    // Extract city and area IDs from the selected area
    const startArea = formData.start_area ? findAreaById(formData.start_area) : null;
    const destinationArea = formData.destination_area ? findAreaById(formData.destination_area) : null;

    const params = {
      start_city: startArea ? startArea.cityId : '',
      start_area: formData.start_area,
      destination_city: destinationArea ? destinationArea.cityId : '',
      destination_area: formData.destination_area,
      departure_date: formData.departure_date,
      round_trip: formData.round_trip
    };

    try {
      const response = await tripSearchApi(params);
      setTrips(response.data || []);
      setError(null);
      setSearchPerformed(true);
    } 
    catch (err) {
      setError('Error fetching trips. Please try again.');
      setTrips([]);
      setSearchPerformed(true);
      console.error(err);
    }
  };

  // Navigate to booking page
  const handleTripSelect = (trip) => { navigate(`/trips/${trip.id}/book`, { state: { trip } });};

  // Helper to find area and its city by area ID
  const findAreaById = (areaId) => {
    for (const city of cities) {
      const area = city.areas.find((a) => a.id === parseInt(areaId));
      if (area) { return { cityId: city.id, area };}
    }
    return null;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 font-mono">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" font-mono min-h-screen bg-cover bg-center  bg-no-repeat" style={{ backgroundImage: `url(${cover})` }}>
      <div className="min-h-screen bg-gradient-to-b from-transparent to-black/40 py-8 px-4">
        <div className="max-w-6xl mx-auto pt-16 pb-8"> <br /><br />
         {/*  <h1 className="text-5xl font-bold text-white text-center mb-10">Book Your Royal Bus Now</h1> <br/> */}
         <br/><br/>
         
          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4">
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  <span className="text-red-500 mr-1">*</span>From
                </label>
                <div className="relative">
                  <select
                    name="start_area"
                    value={formData.start_area}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 pr-8 text-gray-600 appearance-none"
                    required
                  >
                    <option value="">Departure Station</option>
                    {cities.map((city) => (
                      <optgroup key={city.id} label={city.name}>
                        {city.areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#A62C2C]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  <span className="text-red-500 mr-1">*</span>To
                </label>
                <div className="relative">
                  <select
                    name="destination_area"
                    value={formData.destination_area}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 pr-8 text-gray-600 appearance-none"
                    required
                  >
                    <option value="">Destination Station</option>
                    {cities.map((city) => (
                      <optgroup key={city.id} label={city.name}>
                        {city.areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#A62C2C]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-[#A62C2C] mb-1">
                  <span className="text-red-500 mr-1">*</span>Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3  "
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#A62C2C] text-white hover:bg-[#8B2525] font-medium rounded-full transition duration-300 text-center"             
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mb-6 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchPerformed && (
            <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-[#A62C2C] mb-6">Available Trips</h3>
              
              {trips.length > 0 ? (
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                      <div className="p-6 flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></div>
                            <span className="font-medium text-gray-900">{trip.start_location}</span>
                          </div>
                          <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1"></div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                            <span className="font-medium text-gray-900">{trip.destination}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                          <div className="text-sm text-[#A62C2C] mb-1">Departure Date</div>
                          <div className="font-medium">{formatDate(trip.departure_date)}</div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                          <div className="text-sm text-[#A62C2C] mb-1">Bus Type</div>
                          <div className="font-medium">{trip.bus_type}</div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex flex-col md:items-end justify-between">
                          <div className="bg-[#A62C2C] text-white hover:bg-[#8B2525] rounded-full py-1 px-3   font-medium mb-3">
                            {trip.price} EGP
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A62C2C]" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-[#A62C2C] text-sm">{trip.available_seats} seats Available</span>
                          </div>
                          <button
                            onClick={() => handleTripSelect(trip)}
                            className="py-2 px-4 bg-[#A62C2C] text-white hover:bg-[#8B2525] transition duration-300 font-medium shadow-sm rounded-full"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg text-gray-600">No trips available for your search.</p>
                  <p className="text-sm text-gray-500 mt-2">Please try changing your locations or date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <br /><br /><br /><br />

    </div>
  );
};

export default TripSearch;