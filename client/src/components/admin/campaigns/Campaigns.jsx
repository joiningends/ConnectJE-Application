import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import axios from "../../../axiosSetup";
import { FiDownload } from "react-icons/fi"; // Example: using Feather Icons

function Campaigns() {
  const { id } = useParams(); // Extracting ID from URL params
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeButton, setActiveButton] = useState("single"); // Track active button state

  useEffect(() => {
    // Load default data (Single Message) on component mount
    handleSingleMessageClick();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSingleMessageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/api/v1/campain/${id}`
      );
      setCampaignData(response.data.reverse()); // Reverse the data here
      setActiveButton("single"); // Set active button state
    } catch (error) {
      console.error("Error fetching single message data:", error);
      setCampaignData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMessageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/api/v1/wgroup/active/${id}`
      );
      setCampaignData(response.data.reverse()); // Reverse the data here
      setActiveButton("group"); // Set active button state
    } catch (error) {
      console.error("Error fetching group message data:", error);
      setCampaignData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleMessageClick = async () => {
    await fetchSingleMessageData();
  };

  const handleGroupMessageClick = async () => {
    await fetchGroupMessageData();
  };

  const handleDownloadExcel = async (groupId, groupName) => {
    try {
      console.log(
        `http://localhost:5001/api/v1/wa/download-messages/${groupId}`
      );
      const response = await axios.get(
        `http://localhost:5001/api/v1/wa/download-messages/${groupId}`,
        { responseType: "blob" }
      );

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
      console.log(`Downloading Excel for group: ${groupName}`);
    } catch (error) {
      console.error(`Error downloading Excel for group ID: ${groupId}`, error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = campaignData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleSingleMessageClick}
          disabled={loading}
          className={`bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded ${
            activeButton === "single" ? "border border-white" : ""
          }`}
          style={{ marginRight: "10px" }}
        >
          <FiDownload style={{ marginBottom: "-2px", marginRight: "4px" }} />
          Single Message
        </button>
        <button
          onClick={handleGroupMessageClick}
          disabled={loading}
          className={`bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded ${
            activeButton === "group" ? "border border-white" : ""
          }`}
        >
          <FiDownload style={{ marginBottom: "-2px", marginRight: "4px" }} />
          Group Message
        </button>
      </div>
      <div>
        <h2 style={{ textAlign: "center" }}>Campaigns</h2>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Success Count
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Failure Count
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(campaign => (
                  <tr key={campaign._id}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      {campaign.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {campaign.successCount || campaign.successcount}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {campaign.failureCount || campaign.failurecount}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDownloadExcel(campaign._id, campaign.name)
                        }
                        className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
                      >
                        <FiDownload
                          style={{ marginBottom: "-2px", marginRight: "4px" }}
                        />
                        Download Excel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={campaignData.length}
                paginate={paginate}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Pagination component
const Pagination = ({ currentPage, itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul style={{ listStyleType: "none", padding: 0, display: "inline-flex" }}>
        {pageNumbers.map(number => (
          <li key={number} style={{ margin: "0 5px" }}>
            <button
              onClick={() => paginate(number)}
              className={`bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded ${
                currentPage === number ? "border border-white" : ""
              } cursor-pointer`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Campaigns;
