import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";
import { ClipLoader } from "react-spinners"; // Import spinner

function UploadAttachment() {
  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;
  const [storageLimit, setStorageLimit] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for file upload

  useEffect(() => {
    const fetchStorageData = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (whatsappuserId) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/v1/clients/clients/${whatsappuserId}`
          );
          const { storagelimit, storageused } = response.data;
          setStorageLimit(storagelimit);
          setStorageUsed(storageused);

          console.log(`http://localhost:5001/api/v1/storage/${whatsappuserId}`);
          const filesResponse = await axios.get(
            `http://localhost:5001/api/v1/storage/${whatsappuserId}`
          );
          const files = filesResponse.data;

          let totalSize = 0;
          files.forEach(file => {
            totalSize += file.size;
          });

          const totalSizeInMB = totalSize / (1024 * 1024);
          setStorageUsed(totalSizeInMB);
          setUploadedFiles(files);
        } catch (error) {
          toast.error("Failed to fetch storage data");
        }
      } else {
        toast.error("whatsappuserId not found in local storage");
      }
    };

    fetchStorageData();
  }, []);

  const handleBack = () => {
    navigate("/bulkWhatsapp");
  };

  const handleFileUpload = async event => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        toast.error("File size exceeds the 5 MB limit");
      } else {
        const whatsappuserId = localStorage.getItem("whatsappuserId");
        if (!whatsappuserId) {
          toast.error("whatsappuserId not found in local storage");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
          await axios.post(
            `http://localhost:5001/api/v1/storage/upload/${whatsappuserId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const filesResponse = await axios.get(
            `http://localhost:5001/api/v1/storage/${whatsappuserId}`
          );
          const files = filesResponse.data;

          let totalSize = 0;
          files.forEach(file => {
            totalSize += file.size;
          });

          const totalSizeInMB = totalSize / (1024 * 1024);
          setStorageUsed(totalSizeInMB);
          setUploadedFiles(files);
          console.log(files);

          toast.success("File uploaded successfully!");
        } catch (error) {
          toast.error("Failed to upload file");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleDeleteFile = async (id, index) => {
    const whatsappuserId = localStorage.getItem("whatsappuserId");
    if (!whatsappuserId) {
      toast.error("whatsappuserId not found in local storage");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5001/api/v1/storage/${whatsappuserId}/${id}`
      );

      const updatedFiles = [...uploadedFiles];
      updatedFiles.splice(index, 1);
      setUploadedFiles(updatedFiles);

      toast.info("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = uploadedFiles.slice(indexOfFirstFile, indexOfLastFile);

  console.log(currentFiles);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(uploadedFiles.length / filesPerPage);

  const storagePercentage = ((storageUsed / storageLimit) * 100).toFixed(2);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <button
          className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors focus:outline-none"
          title="Go Back"
          onClick={handleBack}
        >
          <FaArrowLeft className="text-xl mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Upload Attachment
        </h1>
        <div className="w-16"></div>
      </div>
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg relative">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
            <ClipLoader size={50} color={"#6B46C1"} loading={loading} />
          </div>
        )}
        <label className="block mb-4 text-lg font-medium text-gray-700">
          Select an attachment to upload:
        </label>
        <div className="flex items-center justify-center w-full mb-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18m-10 4v1m0-12v1"
              ></path>
            </svg>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG, or GIF (MAX. 5 MB)
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Storage Usage</h2>
          <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
            <div
              className="bg-purple-600 h-6 rounded-full"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          <p className="text-gray-700">
            Used: {storageUsed.toFixed(2)} MB / Available:{" "}
            {(storageLimit - storageUsed).toFixed(2)} MB
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Uploaded Files:</h2>
          {currentFiles.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold">
                    File Name
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold">
                    Size (MB)
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-sm">{file.filename}</td>
                    <td className="px-4 py-2 text-sm">
                      {(file.size / (1024 * 1024)).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none"
                        onClick={() => handleDeleteFile(file._id, index)}
                      >
                        <FaTrashAlt className="inline-block mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700">No files uploaded yet.</p>
          )}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadAttachment;
