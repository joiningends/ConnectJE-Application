import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaCopy, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

export function WaProfile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingCredit, setRemainingCredit] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const whatsappuserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/profiles/client/${whatsappuserId}`
        );
        setProfiles(response.data);
        console.log(
          `http://localhost:5001/api/v1/profiles/client/${whatsappuserId}`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCreditData = async () => {
      try {
        const whatsappuserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/clients/clients/${whatsappuserId}`
        );
        setRemainingCredit(response.data.Totalcredit);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfiles();
    fetchCreditData();
  }, []);

  const handleAddNumber = () => {
    navigate("/AddWhatsapp");
  };

  const handleReconnect = async (profileId, instanceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/profiles/${profileId}`
      );
      setSelectedProfile({ ...response.data, instanceId });
    } catch (error) {
      toast.error("Failed to reconnect");
    }
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleRegenerateQrCode = async () => {
    setIsFetching(true);
    try {
      if (selectedProfile && selectedProfile.instance_id) {
        const response = await axios.post(
          `http://localhost:5001/api/v1/wa/qr/${selectedProfile?.instance_id}/64da53e6c44e5`
        );
        setQrCode(response.data.base64);
        toast.success("QR Code regenerated successfully");
      } else {
        toast.error("No instance ID found");
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data == "Instance ID has been used") {
        toast.error("No need to reconnect; you are already connected.");
      } else if (error?.response?.data == "Instance ID Invalidated") {
        toast.error(
          "Please delete this profile and create one with the same number."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (selectedProfile) {
      handleRegenerateQrCode();
    }
  }, [selectedProfile]);

  const handleCopyToClipboard = text => {
    navigator.clipboard.writeText(text);
    toast.success("Instance ID copied to clipboard");
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProfiles.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = async profileId => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/profiles/${profileId}`);
      setProfiles(profiles.filter(profile => profile._id !== profileId));
      toast.success("Profile deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const filteredProfiles = profiles.filter(
    profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.mobile_no.includes(searchTerm)
  );

  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen font-poppins">
        <ToastContainer />
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          WA Profile
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex-grow mr-4">
            <input
              type="text"
              placeholder="Search profile..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            className="flex items-center px-4 py-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors focus:outline-none"
            title="Add new number"
            onClick={handleAddNumber}
            style={{ backgroundColor: "#B197FC" }}
          >
            <FaPlus className="text-xl mr-2" /> Add new Number
          </button>
        </div>

        <div
          className="mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow-sm flex items-center justify-between"
          style={{ width: "20rem" }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Credit Balance:</h2>
          <p className="text-xl text-gray-600">{remainingCredit}</p>
        </div>

        <div className="overflow-hidden border border-gray-200 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                >
                  S. No.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                >
                  Profile Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                >
                  Mobile Number
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                >
                  Instance ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-center text-sm font-normal text-gray-500"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedProfiles.map((profile, index) => (
                <tr key={profile._id} className="divide-x divide-gray-200">
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                    {profile.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {profile.mobile_no}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {profile.instance_id}
                    <FaCopy
                      className="inline ml-2 text-gray-400 cursor-pointer hover:text-gray-600"
                      title="Copy Instance ID"
                      onClick={() => handleCopyToClipboard(profile.instance_id)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                    <button
                      className="bg-purple-300 text-white rounded-lg px-3 py-1 hover:bg-purple-400 transition-colors focus:outline-none mr-2"
                      onClick={() =>
                        handleReconnect(profile._id, profile.instance_id)
                      }
                      style={{ backgroundColor: "#B197FC" }}
                    >
                      Reconnect
                    </button>
                    <button
                      className="bg-red-500 text-white rounded-lg px-1 py-1 hover:bg-red-600 transition-colors focus:outline-none"
                      onClick={() => handleDelete(profile._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center mt-6">
          <a
            href="#"
            onClick={handlePreviousPage}
            className={`mx-1 cursor-pointer text-sm font-semibold text-gray-900 ${
              currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
          >
            ← Previous
          </a>
          {[
            ...Array(Math.ceil(filteredProfiles.length / itemsPerPage)).keys(),
          ].map(number => (
            <a
              key={number + 1}
              href="#"
              onClick={() => handlePageChange(number + 1)}
              className={`mx-1 flex items-center rounded-md border border-gray-400 px-3 py-1 text-gray-900 hover:scale-105 ${
                currentPage === number + 1 ? "bg-gray-200" : ""
              }`}
            >
              {number + 1}
            </a>
          ))}
          <a
            href="#"
            onClick={handleNextPage}
            className={`mx-1 cursor-pointer text-sm font-semibold text-gray-900 ${
              currentPage === Math.ceil(filteredProfiles.length / itemsPerPage)
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            Next →
          </a>
        </div>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedProfile.name}
              </p>
              <p>
                <strong>Mobile Number:</strong> {selectedProfile.mobile_no}
              </p>
              <p>
                <strong>Instance ID:</strong> {selectedProfile.instance_id}
              </p>
              <p className="text-red-500">
                QR code is valid for only 3 seconds. Please regenerate if
                needed.
              </p>
            </div>
            {isFetching ? (
              <div className="mt-4 flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : (
              qrCode && (
                <div className="mt-4 flex justify-center">
                  <img src={`${qrCode}`} alt="QR Code" className="w-40 h-40" />
                </div>
              )
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors focus:outline-none"
                onClick={handleRegenerateQrCode}
                disabled={isFetching}
              >
                Regenerate QR Code
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
