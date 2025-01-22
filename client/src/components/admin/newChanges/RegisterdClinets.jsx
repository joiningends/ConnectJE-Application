import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../axiosSetup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

export default function RegisteredUsers() {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [autoRefetchInterval, setAutoRefetchInterval] = useState(null);
  const participantsPerPage = 10;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/register/${id}/participants`
        );
        setParticipants(response.data.participants);
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast.error("Failed to fetch participants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();

    // Set up auto-refetch interval
    const interval = setInterval(fetchParticipants, 30000);
    setAutoRefetchInterval(interval);

    // Clean up interval on component unmount
    return () => {
      if (autoRefetchInterval) {
        clearInterval(autoRefetchInterval);
      }
    };
  }, [id]);

  const filteredParticipants = participants.filter(participant =>
    participant.participantFields.some(field =>
      field.fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );
  const totalPages = Math.ceil(
    filteredParticipants.length / participantsPerPage
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleEditSubmit = async participantId => {
    try {
      const participant = participants.find(p => p._id === participantId);
      const updatedFields = participant.participantFields.map(field => {
        if (
          field.fieldName === "Name" ||
          field.fieldName === "Email" ||
          field.fieldName === "Phone Number" ||
          field.fieldName === "MobileNumber"
        ) {
          return {
            ...field,
            fieldValue:
              editingParticipant[field.fieldName] ||
              editingParticipant["Phone"],
          };
        }
        return field;
      });

      const response = await axios.put(
        `http://localhost:5001/api/v1/register/update/${participantId}`,
        {
          participantFields: updatedFields,
        }
      );

      if (response.status === 200) {
        setParticipants(
          participants.map(p =>
            p._id === participantId
              ? { ...p, participantFields: updatedFields }
              : p
          )
        );
        setEditingParticipant(null);
        toast.success("Participant updated successfully");
      } else {
        throw new Error("Failed to update participant");
      }
    } catch (error) {
      console.error("Error updating participant:", error);
      toast.error("Failed to update participant. Please try again.");
    }
  };

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

  const handleDownloadExcel = () => {
    try {
      const wsData = [
        ["Name", "Email", "Phone", "Time Slot", "Scanner", "Optometrist"],
      ];

      filteredParticipants.forEach(participant => {
        const row = [
          participant.participantFields.find(
            field => field.fieldName === "Name"
          )?.fieldValue,
          participant.participantFields.find(
            field => field.fieldName === "Email"
          )?.fieldValue,
          participant.participantFields.find(
            field =>
              field.fieldName === "Phone Number" ||
              field.fieldName === "MobileNumber"
          )?.fieldValue,
          participant.participantFields.find(
            field => field.fieldName === "timeslot"
          )?.fieldValue,
          participant.qrcodescanned ? "Yes" : "No",
          participant.qrcodescannedbyop ? "Yes" : "No",
        ];
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Participants");

      XLSX.writeFile(wb, `Event_${id}_Participants.xlsx`);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download Excel file. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Registered Clients
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleDownloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Download Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">
          Loading participants...
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No participants found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Scanner
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Optometrist
                  </th>
                  <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentParticipants.map((participant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">
                      {editingParticipant &&
                      editingParticipant._id === participant._id ? (
                        <input
                          type="text"
                          value={editingParticipant.Name}
                          onChange={e =>
                            setEditingParticipant({
                              ...editingParticipant,
                              Name: e.target.value,
                            })
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        participant.participantFields.find(
                          field => field.fieldName === "Name"
                        )?.fieldValue
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {editingParticipant &&
                      editingParticipant._id === participant._id ? (
                        <input
                          type="email"
                          value={editingParticipant.Email}
                          onChange={e =>
                            setEditingParticipant({
                              ...editingParticipant,
                              Email: e.target.value,
                            })
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        participant.participantFields.find(
                          field => field.fieldName === "Email"
                        )?.fieldValue
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {editingParticipant &&
                      editingParticipant._id === participant._id ? (
                        <input
                          type="tel"
                          value={editingParticipant.Phone || ""}
                          onChange={e =>
                            setEditingParticipant({
                              ...editingParticipant,
                              Phone: e.target.value,
                            })
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : (
                        participant.participantFields.find(
                          field =>
                            field.fieldName === "Phone Number" ||
                            field.fieldName === "MobileNumber"
                        )?.fieldValue
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {
                        participant.participantFields.find(
                          field => field.fieldName === "timeslot"
                        )?.fieldValue
                      }
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {participant.qrcodescanned ? "Yes" : "No"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {participant.qrcodescannedbyop ? "Yes" : "No"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {editingParticipant &&
                      editingParticipant._id === participant._id ? (
                        <>
                          <button
                            onClick={() => handleEditSubmit(participant._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600 transition-colors duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingParticipant(null)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingParticipant({
                              _id: participant._id,
                              Name: participant.participantFields.find(
                                field => field.fieldName === "Name"
                              )?.fieldValue,
                              Email: participant.participantFields.find(
                                field => field.fieldName === "Email"
                              )?.fieldValue,
                              Phone: participant.participantFields.find(
                                field =>
                                  field.fieldName === "Phone Number" ||
                                  field.fieldName === "MobileNumber"
                              )?.fieldValue,
                            })
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                        >
                          Edit
                        </button>
                      )}
                      {participant.qrcodescannedbyop && (
                        <button
                          onClick={() => handleDownloadPDF(participant._id)}
                          className="bg-purple-500 text-white px-2 py-1 rounded ml-2 hover:bg-purple-600 transition-colors duration-300"
                        >
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
