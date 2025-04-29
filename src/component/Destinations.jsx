import { useState } from "react";
import { Search, MapPin, ChevronDown, Bus } from "lucide-react";

export default function Station() {
  const [activeTab, setActiveTab] = useState("popular");
  const [searchTerm, setSearchTerm] = useState("");

  const stations = {
    popular: [
      { id: 1, name: "Cairo", region: "Capital" },
      { id: 2, name: "Alexandria", region: "Coastal" },
      { id: 3, name: "Hurghada", region: "Red Sea" },
      { id: 4, name: "Sharm El Sheikh", region: "Sinai Peninsula" },
      { id: 5, name: "Luxor", region: "Upper Egypt" },
      { id: 6, name: "Aswan", region: "Upper Egypt" },
    ],
    regions: [
      {
        id: "capital",
        name: "Capital Region",
        stations: ["Cairo", "Giza", "6th October"],
      },
      {
        id: "delta",
        name: "Delta",
        stations: ["Tanta", "Mansoura", "Damietta"],
      },
      {
        id: "canal",
        name: "Suez Canal",
        stations: ["Ismailia", "Port Said", "Suez"],
      },
      {
        id: "coastal",
        name: "Coastal",
        stations: ["Alexandria", "Marsa Matrouh", "Damietta"],
      },
      {
        id: "upper",
        name: "Upper Egypt",
        stations: ["Luxor", "Aswan", "Minya", "Sohag"],
      },
    ],
    all: [
      { id: 1, name: "Cairo", region: "Capital" },
      { id: 2, name: "Alexandria", region: "Coastal" },
      { id: 3, name: "Luxor", region: "Upper Egypt" },
      { id: 4, name: "Aswan", region: "Upper Egypt" },
      { id: 5, name: "Hurghada", region: "Red Sea" },
      { id: 6, name: "Sharm El Sheikh", region: "Sinai Peninsula" },
      { id: 7, name: "Tanta", region: "Delta" },
      { id: 8, name: "Mansoura", region: "Delta" },
      { id: 9, name: "Ismailia", region: "Suez Canal" },
      { id: 10, name: "Port Said", region: "Suez Canal" },
      { id: 11, name: "Suez", region: "Suez Canal" },
      { id: 12, name: "Giza", region: "Capital" },
    ],
  };

  // Filter stations based on search term
  const filteredStations = stations[
    activeTab === "regions" ? "all" : activeTab
  ].filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [expandedRegion, setExpandedRegion] = useState(null);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-mono text-[#A62C2C] mb-2">
          Destinations
        </h2>
        <p className="font-mono text-[#A62C2C] text-sm md:text-base">
          Find your next destination with our extensive network
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 md:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-[#A62C2C] focus:border-[#A62C2C] font-mono text-[#A62C2C] text-sm md:text-base"
          placeholder="Search for destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs - Responsive */}
      <div className="flex flex-wrap border-b border-gray-300 mb-6 overflow-x-auto">
        <button
          className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${
            activeTab === "popular"
              ? "font-mono text-[#A62C2C] border-b-2 border-[#A62C2C]"
              : "text-gray-500 hover:text-[#A62C2C]"
          }`}
          onClick={() => setActiveTab("popular")}
        >
          Popular Destinations
        </button>
        <button
          className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${
            activeTab === "regions"
              ? "font-mono text-[#A62C2C] border-b-2 border-[#A62C2C]"
              : "text-gray-500 hover:text-[#A62C2C]"
          }`}
          onClick={() => setActiveTab("regions")}
        >
          By Region
        </button>
        <button
          className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "font-mono text-[#A62C2C] border-b-2 border-[#A62C2C]"
              : "text-gray-500 hover:text-[#A62C2C]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Destinations
        </button>
      </div>

      {/* Content */}
      <div className="pb-8">
        {activeTab === "regions" ? (
          <div className="space-y-4">
            {stations.regions.map((region) => (
              <div
                key={region.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="flex justify-between items-center p-3 md:p-4 bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedRegion(
                      expandedRegion === region.id ? null : region.id
                    )
                  }
                >
                  <h3 className="font-medium text-base md:text-lg text-gray-800">
                    {region.name}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-[#A62C2C] transition-transform duration-300 ${
                      expandedRegion === region.id ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedRegion === region.id && (
                  <div className="p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                    {region.stations.map((station, idx) => (
                      <div
                        key={idx}
                        className="flex items-center p-2 md:p-3 rounded-md hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <MapPin
                          size={16}
                          className="text-[#A62C2C] mr-2 flex-shrink-0"
                        />
                        <span className="text-gray-700 text-sm md:text-base">
                          {station}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center p-3 md:p-4 border border-gray-200 rounded-lg hover:border-[#A62C2C] hover:bg-red-50 cursor-pointer transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                    <Bus size={16} className="text-[#A62C2C]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base text-gray-800">
                      {station.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      {station.region}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No destinations found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}