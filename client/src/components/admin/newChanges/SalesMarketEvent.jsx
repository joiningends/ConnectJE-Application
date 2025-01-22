import axios from "../../../axiosSetup";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SalesMarketEvent() {
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
          `http://localhost:5001/api/v1/eventmodel/all/sales/marketing/${whatsappuserId}`
        );
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setFilteredEvents([]); // Set to empty array on error
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
  const currentEvents = Array.isArray(filteredEvents)
    ? filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
    : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleShowDetails = eventId => {
    alert(`Show details for event ID: ${eventId}`);
  };

  // Styles
  const containerStyle = {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    maxWidth: "1200px",
    margin: "0 auto",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    color: "#333",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600",
  };

  const buttonStyle = {
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
  };

  const searchStyle = {
    padding: "10px",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    position: "relative",
  };

  const searchIconStyle = {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#B197FC",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const thStyle = {
    borderBottom: "2px solid #ddd",
    padding: "12px 15px",
    textAlign: "left",
    backgroundColor: "#B197FC",
    color: "white",
    fontWeight: "600",
  };

  const tdStyle = {
    borderBottom: "1px solid #ddd",
    padding: "10px 15px",
    textAlign: "left",
    fontSize: "14px",
    color: "#333",
  };

  const evenRowStyle = {
    backgroundColor: "#f7f7f7",
  };

  const hoverRowStyle = {
    backgroundColor: "#e2e6ea",
    cursor: "pointer",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const pageLinkStyle = {
    margin: "0 5px",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#B197FC",
    color: "white",
    border: "none",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Sales & Marketing Events</h1>

      <button style={buttonStyle} onClick={() => navigate("/AddEvent")}>
        <FaPlus style={{ marginRight: "5px" }} />
        Add Event
      </button>

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <FaSearch style={searchIconStyle} />
        <input
          type="text"
          placeholder="Search event by name"
          style={searchStyle}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Event Name</th>
                <th style={thStyle}>Start Time</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr
                  key={event._id}
                  style={index % 2 === 0 ? evenRowStyle : {}}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor =
                      hoverRowStyle.backgroundColor)
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? evenRowStyle.backgroundColor : "")
                  }
                >
                  <td style={tdStyle}>{event.eventName}</td>
                  <td style={tdStyle}>{event.startTime}</td>
                  <td style={tdStyle}>{getStatusText(event.status)}</td>
                  <td style={tdStyle}>
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

          <div style={paginationStyle}>
            {Array.from(
              { length: Math.ceil(filteredEvents.length / eventsPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  style={pageLinkStyle}
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

export default SalesMarketEvent;
