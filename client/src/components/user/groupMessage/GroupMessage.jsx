import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { FaEnvelope, FaPaperPlane, FaUpload, FaDownload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs"; // Import dayjs for date formatting

function GroupMessage() {
  const [contactGroups, setContactGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 9;
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const type = localStorage.getItem("whatsappuserId");
    setUserType(type);
  }, []);

  useEffect(() => {
    const fetchContactGroups = async () => {
      try {
        const whatsappuserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/wgroup/active/${whatsappuserId}`
        );
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setContactGroups(response.data);
        } else {
          setContactGroups([]);
        }
      } catch (error) {
        console.error("Error fetching contact groups:", error);
        // toast.error("Error fetching contact groups");
        setContactGroups([]);
      }
    };

    fetchContactGroups();
  }, [userType]);

  // Ensure contactGroups is always an array and reverse it
  const filteredGroups = Array.isArray(contactGroups)
    ? contactGroups
        .filter(group =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reverse() // Reverse the array here
    : [];

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredGroups.length / groupsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handleSendGroupMessage = () => {
    navigate("/sendGroupMessage");
    toast.info("Sending group messages...");
  };

  const handleUploadAttachment = () => {
    navigate("/uploadAttachment");
  };

  const handleDownload = async group => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/wa/download-messages/${group._id}`,
        {
          responseType: "blob",
          headers: {
            Accept: "text/csv",
          },
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      const date = dayjs().format("YYYY-MM-DD_HH-mm-ss");
      link.href = url;
      link.setAttribute("download", `${group.name}_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started.");
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("Error downloading the file.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins">
      <ToastContainer />

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Group Message
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex-grow mr-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="absolute top-2 right-2 bg-purple-800 text-white p-2 rounded text-xs">
          Please reload the page to see the statistics.
        </div>
        <div className="flex items-center">
          <button
            className="flex items-center px-4 py-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors focus:outline-none"
            title="Send Group Message"
            onClick={handleSendGroupMessage}
            style={{ backgroundColor: "#B197FC" }}
          >
            <FaPaperPlane className="text-xl mr-2" /> Send Group Message
          </button>
          <button
            className="ml-2 p-2 bg-purple-300 text-white rounded-full hover:bg-purple-400 transition-colors focus:outline-none"
            title="Upload Attachment"
            onClick={handleUploadAttachment}
            style={{ backgroundColor: "#B197FC" }}
          >
            <FaUpload className="text-xl" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentGroups.length > 0 ? (
          currentGroups.map(group => (
            <div
              key={group._id}
              className="flex flex-col items-center justify-between p-6 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105 relative"
            >
              <div className="flex items-center w-full mb-4">
                <div className="w-16 h-16 mr-4 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaEnvelope className="text-blue-500 text-3xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {group.name}
                  </h2>
                </div>
                <button
                  className="absolute top-4 right-4 text-purple-300 hover:text-purple-400"
                  onClick={() => handleDownload(group)}
                  title="Download CSV"
                >
                  <FaDownload className="text-xl" />
                </button>
              </div>
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    <strong>Success:</strong> {group.successcount}
                  </span>
                  <span className="text-gray-600">
                    <strong>Failure:</strong> {group.failurecount}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <FaEnvelope className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500">No contact groups found.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mt-6">
        <a
          href="#"
          className={`mx-1 text-sm font-semibold text-gray-900 ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
          onClick={e => currentPage > 1 && handleClick(e, currentPage - 1)}
          style={{ color: "#B197FC" }}
        >
          ← Previous
        </a>
        {pageNumbers.map(number => (
          <a
            key={number}
            href="#"
            className={`mx-1 flex items-center rounded-md border border-gray-400 px-3 py-1 text-gray-900 hover:scale-105 ${
              currentPage === number ? "bg-purple-300 text-white" : ""
            }`}
            onClick={e => handleClick(e, number)}
            style={{
              borderColor: "#B197FC",
              color: currentPage === number ? "#ffffff" : "#B197FC",
              backgroundColor:
                currentPage === number ? "#B197FC" : "transparent",
            }}
          >
            {number}
          </a>
        ))}
        <a
          href="#"
          className={`mx-2 text-sm font-semibold text-gray-900 ${
            currentPage === pageNumbers.length ? "cursor-not-allowed" : ""
          }`}
          onClick={e =>
            currentPage < pageNumbers.length && handleClick(e, currentPage + 1)
          }
          style={{ color: "#B197FC" }}
        >
          Next →
        </a>
      </div>
    </div>
  );
}

export default GroupMessage;
