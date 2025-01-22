import axios from "../../axiosSetup";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaLock, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCloseRegistrationModal, setShowCloseRegistrationModal] =
    useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const eventsPerPage = 5;
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/eventmodel"
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = dateString => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredEvents = events.filter(
    event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventDate.includes(searchTerm) ||
      (event.endDate && event.endDate.includes(searchTerm))
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = eventId => {
    navigate(`/UserRegisteredDetails/${eventId}`); // Navigate to the route with eventId
  };

  const handleCloseRegistration = eventId => {
    setSelectedEventId(eventId);
    setShowCloseRegistrationModal(true);
  };

  const handleConfirmCloseRegistration = () => {
    console.log(`Close registration for event ${selectedEventId}`);
    setShowCloseRegistrationModal(false);
  };

  const handleViewRegisteredUsers = eventId => {
    console.log(`View registered users for event ${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Event Management
        </h1>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Event Name</th>
                <th className="py-3 px-6 text-left">Start Date</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentEvents.map(event => (
                <tr
                  key={event._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {event.eventName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(event.eventDate)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {event.endDate ? formatDate(event.endDate) : "N/A"}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleViewDetails(event._id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full mr-2 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        aria-label="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleCloseRegistration(event._id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full mr-2 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        aria-label="Close Registration"
                      >
                        <FaLock />
                      </button>
                      {/* <button
                        onClick={() => handleViewRegisteredUsers(event._id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                        aria-label="View Registered Users"
                      >
                        <FaUsers />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`mx-1 px-4 py-2 rounded ${
                number === currentPage
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
      {showCloseRegistrationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Close Registration</h2>
            <p className="mb-6">
              Are you sure you want to close registration for this event?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full mr-2 transition duration-300 ease-in-out"
                onClick={() => setShowCloseRegistrationModal(false)}
              >
                No
              </button>
              <button
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                onClick={handleConfirmCloseRegistration}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
