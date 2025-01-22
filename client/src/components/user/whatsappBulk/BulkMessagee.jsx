import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { FaEnvelope, FaPaperPlane, FaUpload, FaDownload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import stopImage from "../../../assets/no-stopping.png";

function BulkMessagee() {
  const [contactGroups, setContactGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state for the loader
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
        setLoading(true);
        console.log(`http://localhost:5001/api/v1/campain/${userType}`);
        const response = await axios.get(
          `http://localhost:5001/api/v1/campain/${userType}`
        );

        if (Array.isArray(response.data)) {
          // Reverse the order of contact groups
          setContactGroups(response.data.reverse());
          console.log(response.data);
        }
      } catch (error) {
        setContactGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContactGroups();
  }, [userType]);

  const filteredGroups = Array.isArray(contactGroups)
    ? contactGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
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

  const handleSendBulkMessage = () => {
    navigate("/bulkMessage");
    toast.info("Sending bulk messages...");
  };

  const handleUploadAttachment = () => {
    navigate("/uploadAttachment");
  };

  const handleDownloadExcel = async groupId => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/wa/download-messages/${groupId}`,
        { responseType: "blob" }
      );

      const group = contactGroups.find(group => group._id === groupId);
      const groupName = group ? group.name : "campaign";

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0].replace(/:/g, "");

      const filename = `${groupName}_${date}_${time}.csv`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.info(`Downloading Excel for group: ${groupName}`);
    } catch (error) {
      toast.error(`Error downloading Excel for group ID: ${groupId}`);
    }
  };

  const handleStopCampaign = async campaignId => {
    try {
      await axios.post("http://localhost:5001/api/v1/wa/stop/stopthecampain", {
        campainid: campaignId,
      });
      toast.success("Campaign stopped successfully.");
    } catch (error) {
      toast.error("Failed to stop the campaign.");
    }
  };

  const isScheduleTimeInFuture = scheduleTime => {
    if (!scheduleTime) return false;
    const currentTime = new Date();
    const scheduleTimeDate = new Date(scheduleTime);
    return scheduleTimeDate > currentTime;
  };

  const formatDate = dateString => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins relative">
      <ToastContainer />
      <div className="absolute top-2 right-2 bg-purple-800 text-white p-2 rounded text-xs">
        Please reload the page to see the statistics.
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Bulk Message
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
        <div className="flex items-center">
          <button
            className="flex items-center px-4 py-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors focus:outline-none"
            title="Send Bulk Message"
            onClick={handleSendBulkMessage}
            style={{ backgroundColor: "#B197FC" }}
          >
            <FaPaperPlane className="text-xl mr-2" /> Send Bulk Message
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
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="loader"></div>
          </div>
        ) : currentGroups.length > 0 ? (
          currentGroups.map(group => (
            <div
              key={group._id}
              className="relative flex flex-col items-center justify-between p-6 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
            >
              {!isScheduleTimeInFuture(group.scheduleTime) && (
                <>
                  <button
                    className="absolute top-2 right-10 p-1 bg-purple-300 text-white rounded-full hover:bg-purple-400 transition-colors focus:outline-none"
                    onClick={() => handleDownloadExcel(group._id)}
                    title="Download Excel"
                  >
                    <FaDownload className="text-sm" />
                  </button>
                  <button
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none"
                    onClick={() => handleStopCampaign(group._id)}
                    title="Stop Campaign"
                  >
                    <img style={{ width: "1rem" }} src={stopImage} />
                  </button>
                </>
              )}
              <div className="flex items-center w-full mb-4">
                <div className="w-16 h-16 mr-4 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaEnvelope className="text-blue-500 text-3xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {group.name}
                  </h2>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    <strong>Success:</strong> {group.successCount}
                  </span>
                  <span className="text-gray-600">
                    <strong>Failure:</strong> {group.failureCount}
                  </span>
                </div>
                {isScheduleTimeInFuture(group.scheduleTime) && (
                  <div className="text-gray-600 text-sm">
                    <strong>Scheduled Message: </strong>
                    {formatDate(group.scheduleTime)},{" "}
                    {new Date(group.scheduleTime).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="loader"></div>
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
            className={`mx-1 px-3 py-1 rounded-sm text-sm font-semibold text-gray-900 ${
              number === currentPage ? "bg-gray-200" : "bg-white"
            }`}
            onClick={e => handleClick(e, number)}
          >
            {number}
          </a>
        ))}
        <a
          href="#"
          className={`mx-1 text-sm font-semibold text-gray-900 ${
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

export default BulkMessagee;
