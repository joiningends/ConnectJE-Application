import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";
import * as XLSX from "xlsx";

export default function EventAdminUser() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [participantPage, setParticipantPage] = useState(1);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const eventsPerPage = 10;
  const participantsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/all/${userId}`
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Data is not an array");
        }

        console.log(response.data);
        setEvents(response.data);
        setFilteredEvents(response.data);
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
      const filtered = events.filter(
        event =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.PlaceofEvent.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, events]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const formatTimeSlot = dateString => {
    if (!dateString) return "N/A";
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    return `${day}-${month}-${year} ${timePart}`;
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleViewParticipants = async eventId => {
    setSelectedEventId(eventId);
    setLoadingParticipants(true);
    setShowPopup(true);

    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/register/${eventId}/participants`
      );
      setParticipants(response.data.participants);
      console.log(response.data.participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to fetch participants. Please try again.");
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEventId(null);
    setParticipants([]);
    setParticipantPage(1);
    setParticipantSearchTerm("");
  };

  const filteredParticipants = participants.filter(participant =>
    participant.participantFields.some(field =>
      field.fieldValue
        .toLowerCase()
        .includes(participantSearchTerm.toLowerCase())
    )
  );

  const indexOfLastParticipant = participantPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );
  const totalParticipantPages = Math.ceil(
    filteredParticipants.length / participantsPerPage
  );

  const paginateParticipants = pageNumber => setParticipantPage(pageNumber);

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

  const handleDownloadPDF = async participantId => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/prescription/downlod/${participantId}`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `prescription_${participantId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const handleEditSubmit = async participantId => {
    try {
      const participant = participants.find(p => p._id === participantId);
      const updatedFields = participant.participantFields.map(field => {
        if (field.fieldName === "Name" || field.fieldName === "Email") {
          return {
            ...field,
            fieldValue: editingParticipant[field.fieldName],
          };
        }
        return field;
      });

      const response = await axios.put(
        `http://localhost:5001/api/v1/register/update/${participantId}`,
        {
          participantFields: updatedFields,
        }
      );

      if (response.status === 200) {
        setParticipants(
          participants.map(p =>
            p._id === participantId
              ? { ...p, participantFields: updatedFields }
              : p
          )
        );
        setEditingParticipant(null);
        toast.success("Participant updated successfully");
      } else {
        throw new Error("Failed to update participant");
      }
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant. Please try again.");
    }
  };

  const handleDownloadExcel = async eventId => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/register/${eventId}/participants`
      );
      const participants = response.data.participants;

      // Get all unique field names except selectedSlot
      const allFields = new Set();
      participants.forEach(participant => {
        participant.participantFields.forEach(field => {
          if (field.fieldName !== "selectedSlot") {
            allFields.add(field.fieldName);
          }
        });
      });

      // Create worksheet data
      const wsData = [Array.from(allFields)];

      participants.forEach(participant => {
        const row = Array.from(allFields).map(fieldName => {
          const field = participant.participantFields.find(
            f => f.fieldName === fieldName
          );
          return field ? field.fieldValue : "";
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

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No events found. Try adjusting your search or add a new event.</p>
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
                  <td className="p-2 whitespace-nowrap">{event.eventDate}</td>
                  <td className="p-2 whitespace-nowrap">{event.startTime}</td>
                  <td className="p-2 whitespace-nowrap">{event.endDate}</td>
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
                    <button
                      onClick={() => handleViewParticipants(event._id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mr-2"
                    >
                      View Registered Clients
                    </button>
                    <button
                      onClick={() => handleDownloadExcel(event._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      Download Excel
                    </button>
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
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Next
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Registered Clients
              </h2>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search participants..."
              value={participantSearchTerm}
              onChange={e => setParticipantSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {loadingParticipants ? (
              <div className="text-center py-8 text-gray-600">
                Loading participants...
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No participants found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Name
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Email
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Phone
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Time Slot
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Scanner
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Optometrist
                        </th>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentParticipants.map((participant, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 whitespace-nowrap">
                            {editingParticipant &&
                            editingParticipant._id === participant._id ? (
                              <input
                                type="text"
                                value={editingParticipant.Name}
                                onChange={e =>
                                  setEditingParticipant({
                                    ...editingParticipant,
                                    Name: e.target.value,
                                  })
                                }
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                            ) : (
                              participant.participantFields.find(
                                field => field.fieldName === "Name"
                              )?.fieldValue
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {editingParticipant &&
                            editingParticipant._id === participant._id ? (
                              <input
                                type="email"
                                value={editingParticipant.Email}
                                onChange={e =>
                                  setEditingParticipant({
                                    ...editingParticipant,
                                    Email: e.target.value,
                                  })
                                }
                                className="w-full p-1 border border-gray-300 rounded"
                              />
                            ) : (
                              participant.participantFields.find(
                                field => field.fieldName === "Email"
                              )?.fieldValue
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {
                              participant.participantFields.find(
                                field =>
                                  field.fieldName === "Phone Number" ||
                                  field.fieldName === "MobileNumber"
                              )?.fieldValue
                            }
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {formatTimeSlot(
                              participant.participantFields.find(
                                field => field.fieldName === "timeslot"
                              )?.fieldValue
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {participant.qrcodescanned ? "Yes" : "No"}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {participant.qrcodescannedbyop ? "Yes" : "No"}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {editingParticipant &&
                            editingParticipant._id === participant._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleEditSubmit(participant._id)
                                  }
                                  className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600 transition-colors duration-300"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingParticipant(null)}
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  setEditingParticipant({
                                    _id: participant._id,
                                    Name: participant.participantFields.find(
                                      field => field.fieldName === "Name"
                                    )?.fieldValue,
                                    Email: participant.participantFields.find(
                                      field => field.fieldName === "Email"
                                    )?.fieldValue,
                                  })
                                }
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                              >
                                Edit
                              </button>
                            )}
                            {participant.qrcodescannedbyop && (
                              <button
                                onClick={() =>
                                  handleDownloadPDF(participant._id)
                                }
                                className="bg-purple-500 text-white px-2 py-1 rounded ml-2 hover:bg-purple-600 transition-colors duration-300"
                              >
                                Download PDF
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => paginateParticipants(participantPage - 1)}
                    disabled={participantPage === 1}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {participantPage} of {totalParticipantPages}
                  </span>
                  <button
                    onClick={() => paginateParticipants(participantPage + 1)}
                    disabled={participantPage === totalParticipantPages}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
