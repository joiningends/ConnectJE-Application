import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";
import * as XLSX from "xlsx";
import { Edit, Eye, FileSpreadsheet, Loader, AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function EventAdminUser() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [categorizedEvents, setCategorizedEvents] = useState({});
  const [eventsPerPage, setEventsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/all/${userId}`
        );

        if (Array.isArray(response.data)) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (Array.isArray(events)) {
      setLoading(true);
      const filtered = events.filter(
        event =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.PlaceofEvent.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort events by start date
      filtered.sort((a, b) => parseDate(a.eventDate) - parseDate(b.eventDate));

      setFilteredEvents(filtered);
      setCategorizedEvents(categorizeEvents(filtered));
      setCurrentPage(1);
      setLoading(false);
    }
  }, [searchTerm, events]);

  const formatDate = dateString => {
    const [day, month, year] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const categorizeEvents = events => {
    const now = new Date();
    return events.reduce(
      (acc, event) => {
        const startDate = parseDate(event.eventDate);
        const endDate = parseDate(event.endDate);
        const endTime = parseTime(event.endTime);

        // Set the end time on the end date
        endDate.setHours(endTime.getHours(), endTime.getMinutes());

        if (event.status !== "approved") {
          acc.unapproved.push(event);
        } else if (now >= startDate && now <= endDate) {
          acc.ongoing.push(event);
        } else if (now > endDate) {
          acc.completed.push(event);
        } else if (startDate > now) {
          acc.upcoming.push(event);
        }

        return acc;
      },
      { ongoing: [], completed: [], unapproved: [], upcoming: [] }
    );
  };

  // Helper function to parse date in DD-MM-YYYY format
  const parseDate = dateString => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper function to parse time in HH:mm format (24-hour)
  const parseTime = timeString => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents =
    categorizedEvents[activeTab]?.slice(indexOfFirstEvent, indexOfLastEvent) ||
    [];
  const totalPages = Math.ceil(
    (categorizedEvents[activeTab]?.length || 0) / eventsPerPage
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleViewParticipants = eventId => {
    navigate(`/registeredUsers/${eventId}`);
  };

  const copyToClipboard = url => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy URL. Please try again.");
      });
  };

  const handleEmailClick = eventId => {
    navigate(`/EmailDetails/${eventId}`);
  };

  const handleDownloadExcel = async eventId => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/register/${eventId}/participants`
      );
      const participants = response.data.participants;

      const allFields = new Set();
      participants.forEach(participant => {
        participant.participantFields.forEach(field => {
          if (field.fieldName !== "selectedSlot") {
            allFields.add(field.fieldName);
          }
        });
      });
      allFields.add("Scanner");
      allFields.add("Optometrist");

      const wsData = [Array.from(allFields)];

      participants.forEach(participant => {
        const row = Array.from(allFields).map(fieldName => {
          if (fieldName === "Scanner") {
            return participant.qrcodescanned ? "Yes" : "No";
          } else if (fieldName === "Optometrist") {
            return participant.qrcodescannedbyop ? "Yes" : "No";
          } else {
            const field = participant.participantFields.find(
              f => f.fieldName === fieldName
            );
            return field ? field.fieldValue : "";
          }
        });
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Participants");

      XLSX.writeFile(wb, `Event_${eventId}_Participants.xlsx`);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  const handleEventsPerPageChange = e => {
    setEventsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-gray-800">
          Event Admin Dashboard
        </h1>
        <a href="/Event" className="text-decoration-none">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
            Add Event
          </button>
        </a>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex space-x-2">
          {["ongoing", "completed", "unapproved", "upcoming"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } relative`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {(tab === "ongoing" || tab === "upcoming") &&
                categorizedEvents[tab]?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {categorizedEvents[tab].length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <ClipLoader color="#8B5CF6" size={50} />
          <p className="text-gray-600 mt-4">Loading events...</p>
        </div>
      ) : currentEvents.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="text-gray-600 mt-4">
            No {activeTab} events found. Try adjusting your search or add a new
            event.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  End Date
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  End Time
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Place of Event
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  URL
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.map((event, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">{event.eventName}</td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDate(event.eventDate)}
                  </td>
                  <td className="p-2 whitespace-nowrap">{event.startTime}</td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDate(event.endDate)}
                  </td>
                  <td className="p-2 whitespace-nowrap">{event.endTime}</td>
                  <td className="p-2 whitespace-nowrap">
                    {event.PlaceofEvent}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {event.emailHtml && (
                      <button
                        onClick={() => copyToClipboard(event.url)}
                        className="text-purple-600 hover:text-purple-900 focus:outline-none"
                        aria-label="Copy URL"
                        title="Copy URL"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEmailClick(event._id)}
                      className="text-purple-600 hover:text-purple-900 focus:outline-none"
                      aria-label="Email Details"
                      title="Email Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </button>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/Events/Edit/${event._id}`)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none"
                        aria-label="Edit Event"
                        title="Edit Event"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewParticipants(event._id)}
                        className="text-purple-600 hover:text-purple-900 focus:outline-none"
                        aria-label="View Registered Clients"
                        title="View Registered Clients"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadExcel(event._id)}
                        className="text-green-600 hover:text-green-900 focus:outline-none"
                        aria-label="Download Excel"
                        title="Download Excel"
                      >
                        <FileSpreadsheet className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <select
            value={eventsPerPage}
            onChange={handleEventsPerPageChange}
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
