import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

const formatDate = dateString => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const EventApprove = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewPopupEventId, setViewPopupEventId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/sales/${user}`
        );

        // Check if data is an array, if not, set it to an empty array
        if (Array.isArray(response.data)) {
          console.log(response.data);
          setEvents(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]); // Set to empty array on error
      }
    };

    fetchEvents();
  }, []);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleApproveClick = event => {
    setSelectedEvent(event);
    setSelectedAction("approved");
    setConfirmMessage(
      `Are you sure you want to approve the event: ${event.eventName}? Once approved, you cannot disapprove the event.`
    );
    setShowConfirmPopup(true);
  };

  const handleDisapproveClick = event => {
    setSelectedEvent(event);
    setSelectedAction("disapproved");
    setConfirmMessage(
      `Are you sure you want to disapprove the event: ${event.eventName}? Once disapproved, you cannot approve the event.`
    );
    setShowConfirmPopup(true);
  };

  const handleConfirmAction = async () => {
    if (selectedAction === "approved") {
      navigate(`/ApproveEvent/${selectedEvent._id}`);
    } else if (selectedAction === "disapproved") {
      try {
        const response = await axios.put(
          `http://localhost:5001/api/v1/eventmodel/events/${selectedEvent._id}`,
          { status: "disapproved" },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          toast.success(
            `Event ${selectedEvent.eventName} has been disapproved.`
          );
          setEvents(
            events.map(event =>
              event._id === selectedEvent._id
                ? { ...event, status: "disapproved" }
                : event
            )
          );

          const user = localStorage.getItem("whatsappuserId");
          const response = await axios.get(
            `http://localhost:5001/api/v1/eventmodel/sales/${user}`
          );

          // Check if data is an array, if not, set it to an empty array
          if (Array.isArray(response.data)) {
            console.log(response.data);
            setEvents(response.data);
          } else {
            console.error("Unexpected data format:", response.data);
            setEvents([]);
          }
        } else {
          toast.error("Failed to update event status.");
        }
      } catch (error) {
        console.error("Error updating event status:", error);
        toast.error("An error occurred while updating the event.");
      }
    }
    setShowConfirmPopup(false);
    setViewPopupEventId(null);
  };

  const handleCancelAction = () => {
    setShowConfirmPopup(false);
    setViewPopupEventId(null);
  };

  const handleViewClick = eventId => {
    setViewPopupEventId(eventId);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <ToastContainer />
      <h1
        style={{
          color: "#B197FC",
          fontSize: "32px",
          fontWeight: "bold",
          letterSpacing: "1px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Event Page
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Event Name
            </th>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Start Date
            </th>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              End Date
            </th>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Start Time
            </th>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              End Time
            </th>
            <th
              style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                fontSize: "16px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event._id}>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                {event.eventName}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                {event.eventDate}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                {event.endDate}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                {event.startTime}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "14px",
                }}
              >
                {event.endTime}
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => handleViewClick(event._id)}
                  style={{
                    backgroundColor: "#B197FC",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginRight: "10px",
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page + 1)}
            style={{
              backgroundColor: currentPage === page + 1 ? "#B197FC" : "#f9f9f9",
              color: currentPage === page + 1 ? "white" : "black",
              padding: "8px 12px",
              margin: "0 5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {viewPopupEventId && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              width: "600px",
              maxWidth: "90%",
              position: "relative",
              overflowY: "auto",
              maxHeight: "80vh",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "26px",
                color: "#B197FC",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Event Details
            </h2>

            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              {events.find(e => e._id === viewPopupEventId) && (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Event Name:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId).eventName
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Place of Event:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId)
                          .PlaceofEvent
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Event Start Date:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId).eventDate
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Event End Date:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId).endDate
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Event Start Time:
                    </label>
                    <input
                      type="time"
                      value={
                        events.find(e => e._id === viewPopupEventId).startTime
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Event End Time:
                    </label>
                    <input
                      type="time"
                      value={
                        events.find(e => e._id === viewPopupEventId).endTime
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Description:
                    </label>
                    <textarea
                      value={
                        events.find(e => e._id === viewPopupEventId).description
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        minHeight: "80px",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Contact Person Name:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId)
                          .ContactPersonName
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Contact Person Phone Number:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId)
                          .ContactPersonPhoneNumber
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div>

                  {/* <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      In Partnership with:
                    </label>
                    <input
                      type="text"
                      value={
                        events.find(e => e._id === viewPopupEventId)
                          .Associationwith
                      }
                      readOnly
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                      }}
                    />
                  </div> */}
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  handleApproveClick(
                    events.find(e => e._id === viewPopupEventId)
                  )
                }
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginRight: "15px",
                }}
              >
                Approve
              </button>

              <button
                onClick={() =>
                  handleDisapproveClick(
                    events.find(e => e._id === viewPopupEventId)
                  )
                }
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Disapprove
              </button>
              <button
                onClick={() => setViewPopupEventId(null)}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginLeft: "1rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 4,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              width: "400px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "20px",
                color: "#B197FC",
                fontWeight: "bold",
              }}
            >
              Confirm Action
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              {confirmMessage}
            </p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleConfirmAction}
                style={{
                  backgroundColor: "#B197FC",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Yes
              </button>
              <button
                onClick={handleCancelAction}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventApprove;
