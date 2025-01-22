import axios from "../../../axiosSetup";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DispatchDetailsTable = () => {
  const [dispatches, setDispatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatchesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const whatsappUserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/eidispatch/by/${whatsappUserId}`
        );
        console.log(response.data);
        setDispatches(response.data);
      } catch (error) {
        console.error("Error fetching dispatches:", error);
        toast.error("Failed to load dispatch data.");
      }
    };

    fetchDispatches();
  }, []);

  const handleDelete = async index => {
    try {
      const dispatchId = dispatches[index]._id;
      const response = await axios.delete(
        `http://localhost:5001/api/v1/eidispatch/${dispatchId}`
      );

      if (response.status === 200) {
        setDispatches(prevDispatches =>
          prevDispatches.filter((_, i) => i !== index)
        );
        toast.success("Dispatch deleted successfully!");
      } else {
        toast.error("Failed to delete dispatch.");
      }
    } catch (error) {
      console.error("Error deleting dispatch:", error);
      toast.error("Failed to delete dispatch.");
    }
  };

  const handleEdit = index => {
    navigate(`/DispatchDetailsUpdate/${index._id}`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredDispatches = dispatches.filter(
    dispatch =>
      dispatch.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispatch.address1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispatch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispatch.pincode.includes(searchQuery) ||
      dispatch.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredDispatches.length / dispatchesPerPage);

  const paginatedDispatches = filteredDispatches.slice(
    currentPage * dispatchesPerPage,
    (currentPage + 1) * dispatchesPerPage
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Dispatch Details
          </h2>
          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md mb-4 md:mb-0 md:mr-4 w-full md:w-64"
            />
            <button
              onClick={() => navigate("/DispatchDetails")}
              className="px-4 py-2 bg-[#B197FC] hover:bg-[#9a6cd8] text-white font-bold rounded-md"
            >
              Add Dispatch Details
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Company Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Address
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Location
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Pincode
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                State
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedDispatches.map((dispatch, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {dispatch.company_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {dispatch.address1}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {dispatch.location}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {dispatch.pincode}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {dispatch.state}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex space-x-2"}
            pageClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            pageLinkClassName={"text-gray-700"}
            previousClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            nextClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            breakClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            activeClassName={"bg-blue-500 text-white"}
          />
        </div>
      </div>
    </div>
  );
};

export default DispatchDetailsTable;
