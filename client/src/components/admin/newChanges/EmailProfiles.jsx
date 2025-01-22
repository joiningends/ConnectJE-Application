import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMail,
  FiServer,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

export default function EmailProfiles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmailProfiles = async () => {
      try {
        const whatsappuserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/emailconfig/${whatsappuserId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching email profiles:", error);
        setError("Failed to load email profiles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmailProfiles();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleAddEmailProfile = () => {
    navigate("/EmailProfile");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <FiMail className="mr-2" /> Email Profiles
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button
          onClick={handleAddEmailProfile}
          className="px-4 py-2 bg-[#B197FC] text-white rounded-md hover:bg-opacity-90 transition flex items-center"
        >
          <FiPlus className="mr-2" /> Add Email Profile
        </button>
      </div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-4">No email profiles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#B197FC] bg-opacity-10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#B197FC]">
                  S. No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#B197FC]">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#B197FC]">
                  Host
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#B197FC]">
                  Port
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#B197FC]">
                  Secure
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center">
                    <FiMail className="mr-2" /> {item.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center">
                    <FiServer className="mr-2" /> {item.host}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.port}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                        item.secure
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <FiLock className="mr-1" />
                      {item.secure ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
            {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md text-[#B197FC] disabled:text-gray-400 hover:bg-[#B197FC] hover:bg-opacity-10 disabled:hover:bg-transparent"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === index + 1
                    ? "bg-[#B197FC] text-white"
                    : "text-[#B197FC] hover:bg-[#B197FC] hover:bg-opacity-10"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md text-[#B197FC] disabled:text-gray-400 hover:bg-[#B197FC] hover:bg-opacity-10 disabled:hover:bg-transparent"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
