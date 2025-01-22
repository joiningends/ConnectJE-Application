import { useState, useEffect } from "react";
import { FaUpload, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import FileSaver from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";

Modal.setAppElement("#root");

function UploadExcel() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recipientNumbers, setRecipientNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numbersPerPage] = useState(5);
  const [editData, setEditData] = useState(null);

  console.log(recipientNumbers);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/numbers/sections/${id}`
      );
      const data = response.data;

      setEditId(data?.recipientNumbers[0]?._id);
      setRecipientNumbers(data.recipientNumbers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const indexOfLastNumber = currentPage * numbersPerPage;
  const indexOfFirstNumber = indexOfLastNumber - numbersPerPage;
  const filteredNumbers = recipientNumbers.filter(number =>
    String(number).includes(searchTerm)
  );

  const currentNumbers = filteredNumbers.slice(
    indexOfFirstNumber,
    indexOfLastNumber
  );
  console.log(currentNumbers);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditModalOpen = data => {
    console.log(data);
    setEditData(data);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => setIsEditModalOpen(false);

  const handleEditChange = (e, field, index) => {
    const updatedData = { ...editData };
    if (field === "number") {
      updatedData.number = e.target.value;
    } else {
      updatedData[`Param${index}`] = e.target.value;
    }
    setEditData(updatedData);
  };

  const handleSaveEdit = async () => {
    let firstId = editId;
    let contactId = editData;

    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/numbers/${firstId}/contact/${editData._id}`,
        contactId
      );
      console.log("Data updated successfully:", response.data);
      fetch(`http://localhost:5001/api/v1/numbers/sections/${id}`)
        .then(response => response.json())
        .then(data => setRecipientNumbers(data.recipientNumbers))
        .catch(error => console.error("Error fetching data:", error));
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setIsEditModalOpen(false);
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      handleUploadExcel(file);
      setIsModalOpen(false);
    }
  };

  const handleUploadExcel = async file => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/v1/numbers/${id}`,
        formData
      );

      // Check if the response status indicates success
      if (response.status >= 200 && response.status < 300) {
        toast.success("File uploaded successfully");
        fetchData(); // Refresh the data after successful upload
        console.log(response.data); // Log the response data
      }
    } catch (error) {
      // Handle specific error messages based on the response
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          toast.error("Please upload your file with correct data.");
        } else {
          toast.error("Server error, please try again.");
        }
      } else {
        // Handle network errors or other unexpected errors
        console.error("Error uploading file:", error);
        toast.error("An error occurred while uploading the file.");
      }
    }
  };

  const handleDownloadTemplate = () => {
    FileSaver.saveAs(
      "http://localhost:5001/newWATemplate.xlsx",
      "template.xlsx"
    );
  };

  const handleDelete = async numberObj => {
    console.log(numberObj);
    let firstId = editId;
    let contactId = numberObj._id;
    console.log(firstId);
    console.log(contactId);

    try {
      const response = await axios.delete(
        `http://localhost:5001/api/v1/numbers/${firstId}/contact/${contactId}`
      );
      console.log("Data deleted successfully:", response.data);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f7fafc",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#2d3748",
          textAlign: "center",
        }}
      >
        Upload Excel
      </h1>

      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flexGrow: 1, marginRight: "16px" }}>
          <input
            type="text"
            placeholder="Search by phone number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e0",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "#3182ce")}
            onBlur={e => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: "#6b46c1",
            color: "#fff",
            borderRadius: "8px",
            transition: "background-color 0.2s",
            outline: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          title="Upload Excel"
          onClick={handleOpenModal}
        >
          <FaUpload style={{ fontSize: "24px", marginRight: "8px" }} /> Upload
          Excel
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Upload Excel"
        style={{
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "10px",
            outline: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            width: "90%",
          },
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>
            Import Contact
          </h2>
          <button
            onClick={handleCloseModal}
            style={{
              color: "#718096",
              fontSize: "24px",
              fontWeight: "bold",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <label
            htmlFor="file-upload"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <FaUpload style={{ marginRight: "8px" }} /> Upload Excel
          </label>

          <input
            type="file"
            accept=".xlsx"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <p style={{ color: "#e53e3e", textAlign: "center" }}>
          You can only upload less than or equal to 1000 numbers max
        </p>
        <button
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#edf2f7",
            color: "#4a5568",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "1rem",
          }}
          onClick={handleDownloadTemplate}
        >
          <FaDownload style={{ marginRight: "8px" }} /> Example template
        </button>
      </Modal>

      <div className="mt-6">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "12px", backgroundColor: "#f7fafc" }}
              >
                Phone Number
              </th>

              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "12px", backgroundColor: "#f7fafc" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentNumbers.map((numberObj, index) =>
              numberObj.contactNumbers &&
              numberObj.contactNumbers.length > 0 ? (
                numberObj.contactNumbers.map((contact, contactIndex) => (
                  <tr key={`${index}-${contactIndex}`}>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ padding: "12px" }}
                    >
                      {contact.number}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ padding: "12px" }}
                    >
                      <button
                        onClick={() => handleEditModalOpen(contact)}
                        className="text-indigo-600 hover:text-indigo-900"
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#667eea",
                          color: "#fff",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <FaEdit />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(contact)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#e53e3e",
                          marginLeft: "1rem",
                        }}
                      >
                        <FaTrash />
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={index}>
                  <td
                    colSpan="2"
                    style={{ padding: "12px", textAlign: "center" }}
                  >
                    No contact numbers available
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={handleEditModalClose}
        contentLabel="Edit Contact"
        style={{
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "10px",
            outline: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          },
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Edit Contact</h2>
          <button
            onClick={handleEditModalClose}
            style={{
              color: "#718096",
              fontSize: "24px",
              fontWeight: "bold",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
        {editData && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{ display: "block", marginBottom: "8px" }}
                htmlFor="editPhoneNumber"
              >
                Phone Number
              </label>
              <input
                id="editPhoneNumber"
                type="text"
                value={editData.number}
                onChange={e => handleEditChange(e, "number")}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #cbd5e0",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </div>
            {[...Array(5).keys()].map(i => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px" }}
                  htmlFor={`param${i + 1}`}
                >
                  Param {i + 1}
                </label>
                <input
                  id={`param${i + 1}`}
                  type="text"
                  value={editData[`Param${i + 1}`] || ""}
                  onChange={e => handleEditChange(e, `Param${i + 1}`, i + 1)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #cbd5e0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  width: "45%",
                  padding: "12px",
                  backgroundColor: "#667eea",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Save
              </button>
              <button
                onClick={handleEditModalClose}
                style={{
                  width: "45%",
                  padding: "12px",
                  backgroundColor: "#cbd5e0",
                  color: "#4a5568",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default UploadExcel;
