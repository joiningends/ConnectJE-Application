"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import axios from "../../../axiosSetup";
import { toast } from "react-toastify";

export default function EventPartner() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [participantPage, setParticipantPage] = useState(1);
  const eventsPerPage = 10;
  const participantsPerPage = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/patner/getall/${userId}`
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Data is not an array");
        }

        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events. Please try again later.");
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
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to fetch participants. Please try again later.");
    } finally {
      setLoadingParticipants(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEventId(null);
    setParticipants([]);
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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "#B197FC" }}
      >
        Event Partner Dashboard
      </h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2
            className="animate-spin"
            size={48}
            style={{ color: "#B197FC" }}
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                  <th className="py-3 px-6 text-left">Event Name</th>
                  <th className="py-3 px-6 text-left">Start Date</th>
                  <th className="py-3 px-6 text-left">Start Time</th>
                  <th className="py-3 px-6 text-left">End Date</th>
                  <th className="py-3 px-6 text-left">End Time</th>
                  <th className="py-3 px-6 text-left">Place of Event</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentEvents.length > 0 ? (
                  currentEvents.map((event, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <span className="font-medium">{event.eventName}</span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <Calendar
                            className="mr-2"
                            size={16}
                            style={{ color: "#B197FC" }}
                          />
                          {event.eventDate}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <Clock
                            className="mr-2"
                            size={16}
                            style={{ color: "#B197FC" }}
                          />
                          {event.startTime}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <Calendar
                            className="mr-2"
                            size={16}
                            style={{ color: "#B197FC" }}
                          />
                          {event.endDate}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <Clock
                            className="mr-2"
                            size={16}
                            style={{ color: "#B197FC" }}
                          />
                          {event.endTime}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <MapPin
                            className="mr-2"
                            size={16}
                            style={{ color: "#B197FC" }}
                          />
                          {event.PlaceofEvent}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          onClick={() => handleViewParticipants(event._id)}
                          className="bg-[#B197FC] text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                        >
                          View Registered Clients
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-3 px-6 text-center">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Registered Clients</h2>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={participantSearchTerm}
                  onChange={e => setParticipantSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            {loadingParticipants ? (
              <div className="flex justify-center items-center h-64">
                <Loader2
                  className="animate-spin"
                  size={48}
                  style={{ color: "#B197FC" }}
                />
              </div>
            ) : (
              <>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                      <th className="py-1 px-2 text-left text-xs">Name</th>
                      <th className="py-1 px-2 text-left text-xs">Email</th>
                      <th className="py-1 px-2 text-left text-xs">
                        Phone Number
                      </th>
                      <th className="py-1 px-2 text-left text-xs">
                        Scanned by Scanner
                      </th>
                      <th className="py-1 px-2 text-left text-xs">
                        Scanned by Optometrist
                      </th>
                      <th className="py-1 px-2 text-left text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {currentParticipants.map((participant, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-2 px-4 text-left whitespace-nowrap">
                          {
                            participant.participantFields.find(
                              field => field.fieldName === "Name"
                            )?.fieldValue
                          }
                        </td>
                        <td className="py-2 px-4 text-left">
                          {
                            participant.participantFields.find(
                              field => field.fieldName === "Email"
                            )?.fieldValue
                          }
                        </td>
                        <td className="py-2 px-4 text-left">
                          {
                            participant.participantFields.find(
                              field =>
                                field.fieldName === "Phone Number" ||
                                field.fieldName === "MobileNumber"
                            )?.fieldValue
                          }
                        </td>
                        <td className="py-2 px-4 text-left">
                          {participant.qrcodescanned ? "Yes" : "No"}
                        </td>
                        <td className="py-2 px-4 text-left">
                          {participant.qrcodescannedbyop ? "Yes" : "No"}
                        </td>
                        <td className="py-2 px-4 text-left">
                          {participant.qrcodescannedbyop && (
                            <button
                              onClick={() => handleDownloadPDF(participant._id)}
                              className="bg-[#B197FC] text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                            >
                              Download PDF
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => paginateParticipants(participantPage - 1)}
                    disabled={participantPage === 1}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    <ChevronLeft size={20} className="mr-2" />
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {participantPage} of {totalParticipantPages}
                  </span>
                  <button
                    onClick={() => paginateParticipants(participantPage + 1)}
                    disabled={participantPage === totalParticipantPages}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={20} className="ml-2" />
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
