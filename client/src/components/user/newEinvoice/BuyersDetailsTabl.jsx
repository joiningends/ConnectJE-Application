import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../axiosSetup";
import "react-toastify/dist/ReactToastify.css";

const BuyersDetailsTable = () => {
  const [buyers, setBuyers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const buyersPerPage = 5;
  const navigate = useNavigate();

  // Fetch buyers data from the API
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const whatsappUserId = localStorage.getItem("whatsappuserId");
        const response = await axios.get(
          `http://localhost:5001/api/v1/eibuyer/by/${whatsappUserId}`
        );
        setBuyers(response.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        toast.error("Failed to fetch buyers data.");
      }
    };

    fetchBuyers();
  }, []);

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/eibuyer/${id}`);
      setBuyers(prevBuyers => prevBuyers.filter(buyer => buyer._id !== id));
      toast.success("Buyer deleted successfully!");
    } catch (error) {
      console.error("Error deleting buyer:", error);
      toast.error("Failed to delete buyer.");
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredBuyers = buyers.filter(
    buyer =>
      buyer.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.address1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.place_of_supply.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredBuyers.length / buyersPerPage);

  const paginatedBuyers = filteredBuyers.slice(
    currentPage * buyersPerPage,
    (currentPage + 1) * buyersPerPage
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Buyer Details
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
              onClick={() => navigate("/BuyersDetails")}
              className="px-4 py-2 bg-[#B197FC] hover:bg-[#9a6cd8] text-white font-bold rounded-md"
            >
              Add Buyer Details
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                GSTIN
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Legal Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Address
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Location
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Place of Supply
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedBuyers.map((buyer, index) => (
              <tr key={buyer._id}>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {buyer.gstin}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {buyer.legal_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {buyer.address1}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {buyer.location}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {buyer.place_of_supply}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(buyer._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/BuyersDetailsUpdate/${buyer._id}`)
                      }
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
            previousLinkClassName={"text-gray-700"}
            nextClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            nextLinkClassName={"text-gray-700"}
            breakClassName={
              "px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            }
            breakLinkClassName={"text-gray-700"}
            activeClassName={"bg-gray-300"}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyersDetailsTable;
