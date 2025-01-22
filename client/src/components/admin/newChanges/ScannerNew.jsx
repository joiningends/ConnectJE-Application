import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import axios from "../../../axiosSetup";

export default function ScannerNew() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [isMobile, setIsMobile] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const itemsPerPage = 10;

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      if (!whatsappUserId) {
        throw new Error("WhatsApp User ID not found in localStorage");
      }
      const response = await axios.get(
        `http://localhost:5001/api/v1/eventmodel/scanner/${whatsappUserId}`
      );
      setEvents(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMessage("Failed to load events. Please try again later.");
    }
  };

  const fetchAttendees = async eventId => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/register/${eventId}/participants`
      );
      const attendeesData = response.data.participants || [];
      setAttendees(attendeesData);
      setFilteredAttendees(attendeesData);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      setAttendees([]);
      setFilteredAttendees([]);
    }
  };

  const handleEventChange = event => {
    const eventId = event.target.value;
    setSelectedEventId(eventId);
    const selectedEvent = events.find(e => e._id === eventId);
    setSelectedEvent(selectedEvent ? selectedEvent.eventName : "");
    setIsScanning(false);
    setScanResult("");
    setCurrentPage(1);
    setNameSearch("");
    setPhoneSearch("");
    if (eventId) {
      fetchAttendees(eventId);
    }
  };

  const startScanning = async () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
      const videoElement = videoRef.current;
      qrScannerRef.current = new QrScanner(videoElement, handleScan, {
        preferredCamera: facingMode,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });
      await qrScannerRef.current.start();
      setErrorMessage("");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage(
        "Unable to access the camera. Please make sure you've granted the necessary permissions."
      );
    }
  };

  const handleScan = async result => {
    if (result) {
      qrScannerRef.current.stop();
      const qrData = result.data;
      const match = qrData.match(/Event ID:\s*(.+)\s*Registration ID:\s*(.+)/);
      if (match) {
        const [, eventId, registrationId] = match;
        await verifyRegistration(registrationId, eventId);
      } else {
        setScanResult("Invalid QR code format");
      }
    }
  };

  const verifyRegistration = async (registrationId, eventId) => {
    try {
      const whatsappUserId = localStorage.getItem("whatsappuserId");

      const response = await axios.get(
        `http://localhost:5001/api/v1/register/scanner/${registrationId}/${eventId}/${whatsappUserId}`
      );

      setScanResult("QR code scanned successfully.");
      await fetchAttendees(eventId);
      setIsScanning(false);
    } catch (error) {
      console.error("Error during verification:", error);
      setScanResult(
        error?.response?.data || "An error occurred during verification."
      );
      setIsScanning(false);
    }
  };

  const handleManualEntry = async (registrationId, eventId) => {
    try {
      await verifyRegistration(registrationId, eventId);
    } catch (error) {
      console.error("Error processing manual entry:", error);
      setErrorMessage("Failed to process manual entry. Please try again.");
    }
  };

  useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    }
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, [isScanning, facingMode]);

  const stopScanning = () => {
    setIsScanning(false);
  };

  const toggleCamera = () => {
    setFacingMode(prevMode =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleSearch = () => {
    const filtered = attendees.filter(attendee => {
      const name = getFieldValue(
        attendee.participantFields,
        "Name"
      ).toLowerCase();
      const phone = getFieldValue(attendee.participantFields, "MobileNumber");
      return (
        name.includes(nameSearch.toLowerCase()) && phone.includes(phoneSearch)
      );
    });
    setFilteredAttendees(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [nameSearch, phoneSearch, attendees]);

  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getFieldValue = (fields, fieldName) => {
    const field = fields.find(f => f.fieldName === fieldName);
    return field ? field.fieldValue : "N/A";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <label
          htmlFor="eventSelect"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select an Event
        </label>
        <select
          id="eventSelect"
          value={selectedEventId}
          onChange={handleEventChange}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC]"
        >
          <option value="">Choose an event</option>
          {events.map(event => (
            <option key={event._id} value={event._id}>
              {event.eventName}
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <div className="mb-6">
          <button
            onClick={() => setIsScanning(true)}
            className="px-4 py-2 bg-[#B197FC] text-white rounded-md hover:bg-[#9f7ff7] focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:ring-opacity-50"
          >
            Open Scanner
          </button>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
            <div className="relative">
              <video ref={videoRef} className="w-full mb-4" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-[#B197FC] rounded-lg w-64 h-64 flex items-center justify-center">
                  <p className="text-[#B197FC] text-lg font-semibold bg-white bg-opacity-75 p-2 rounded">
                    Place QR code here
                  </p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={toggleCamera}
                  className="absolute bottom-2 left-2 p-2 bg-white rounded-full shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#B197FC]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={stopScanning}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-md text-red-700">
          {errorMessage}
        </div>
      )}

      {scanResult && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-md">
          <h3 className="font-bold text-green-700">Scan Result:</h3>
          <p>{scanResult}</p>
        </div>
      )}

      {selectedEventId && (
        <>
          <div className="mb-4 flex space-x-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC]"
            />
            <input
              type="text"
              placeholder="Search by phone..."
              value={phoneSearch}
              onChange={e => setPhoneSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC]"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">S.No</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Phone</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendees.map((attendee, index) => (
                  <tr
                    key={attendee._id}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getFieldValue(attendee.participantFields, "Name")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getFieldValue(attendee.participantFields, "Email")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {getFieldValue(
                        attendee.participantFields,
                        "MobileNumber"
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {attendee.qrcodescanned ? (
                        <span className="text-green-500 font-semibold">
                          Already Entered
                        </span>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleManualEntry(attendee._id, selectedEventId)
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          >
                            Manual Entry
                          </button>
                          <button
                            onClick={() => setIsScanning(true)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            Scan QR Code
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAttendees.length)}{" "}
              of {filteredAttendees.length} entries
            </div>
            <div className="flex gap-2">
              {Array.from(
                { length: Math.ceil(filteredAttendees.length / itemsPerPage) },
                (_, i) => i + 1
              ).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-[#B197FC] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
