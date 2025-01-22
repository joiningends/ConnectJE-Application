import axios from "../../../axiosSetup";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NewAllEventUserPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);

  useEffect(() => {
    const fetchEvents = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");

      if (!whatsappuserId) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/all/${whatsappuserId}`
        );
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusText = status => {
    switch (status) {
      case "pending":
        return "Pending for Approval";
      case "approved":
        return "Approved";
      case "disapproved":
        return "Disapproved";
      default:
        return "Unknown";
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(e =>
          e.eventName.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleShowDetails = eventId => {
    alert(`Show details for event ID: ${eventId}`);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          color: "#333",
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        Sales & Marketing Events
      </h1>

      <button
        style={{
          padding: "10px 15px",
          backgroundColor: "#B197FC",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
          position: "absolute",
          right: "20px",
          top: "20px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => navigate("/AddEvent")}
      >
        <FaPlus style={{ marginRight: "5px" }} />
        Add Event
      </button>

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <FaSearch
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#B197FC",
          }}
        />
        <input
          type="text"
          placeholder="Search event by name"
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            paddingLeft: "35px",
          }}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "12px 15px",
                    textAlign: "left",
                    backgroundColor: "#B197FC",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Event Name
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "12px 15px",
                    textAlign: "left",
                    backgroundColor: "#B197FC",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Start Time
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "12px 15px",
                    textAlign: "left",
                    backgroundColor: "#B197FC",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #ddd",
                    padding: "12px 15px",
                    textAlign: "left",
                    backgroundColor: "#B197FC",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr
                  key={event._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f7f7f7" : "",
                    cursor: "pointer",
                  }}
                >
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 15px",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {event.eventName}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 15px",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {event.startTime}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 15px",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {getStatusText(event.status)}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 15px",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {event.status !== "disapproved" && (
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#B197FC",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShowDetails(event._id)}
                      >
                        Show Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {Array.from(
              { length: Math.ceil(filteredEvents.length / eventsPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  style={{
                    margin: "0 5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    backgroundColor: "#B197FC",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default NewAllEventUserPage;
