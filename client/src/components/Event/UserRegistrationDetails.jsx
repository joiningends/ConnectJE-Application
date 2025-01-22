import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "../../axiosSetup";
import { useParams } from "react-router-dom";

const UserRegistrationDetails = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/register/${id}/participants`
        );
        setParticipants(response.data.participants || []);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [id]);

  // Helper function to format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Get day with leading zero
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (0-based, so add 1) with leading zero
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

  const allFields =
    participants && Array.isArray(participants)
      ? participants.reduce((fields, participant) => {
          participant.participantFields.forEach(field => {
            if (!fields.includes(field.fieldName)) {
              fields.push(field.fieldName);
            }
          });
          return fields;
        }, [])
      : [];

  const filteredParticipants = participants.filter(participant =>
    participant.participantFields.some(field =>
      field.fieldValue
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastParticipant = currentPage * usersPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - usersPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
        Customer Details
      </h1>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-purple-200 rounded-lg overflow-hidden">
          <thead className="bg-purple-700 text-white">
            <tr>
              {allFields.map(field => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-200">
            {currentParticipants.map(participant => (
              <tr key={participant._id}>
                {allFields.map(field => {
                  const fieldValue = participant.participantFields.find(
                    f => f.fieldName === field
                  )?.fieldValue;

                  // Check if the field value is a date, and format it
                  const formattedValue =
                    fieldValue && fieldValue.includes("T")
                      ? formatDate(fieldValue)
                      : fieldValue || "-";

                  return (
                    <td
                      key={field}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{indexOfFirstParticipant + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastParticipant, filteredParticipants.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredParticipants.length}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({
              length: Math.ceil(filteredParticipants.length / usersPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredParticipants.length / usersPerPage)
              }
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationDetails;
