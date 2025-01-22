import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

const SellerDetailsTable = () => {
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const sellersPerPage = 5;
  const navigate = useNavigate();

  // Fetch sellers from API on component mount
  useEffect(() => {
    const fetchSellers = async () => {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eiseller/by/${whatsappUserId}`
        );
        setSellers(response.data);
      } catch (error) {
        console.error("Failed to fetch seller details:", error);
      }
    };

    fetchSellers();
  }, []);

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/eiseller/${id}`);
      setSellers(sellers.filter(seller => seller._id !== id));
    } catch (error) {
      console.error("Failed to delete seller:", error);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredSellers = sellers.filter(
    seller =>
      seller.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.address1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.pincode.includes(searchQuery) ||
      seller.state_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSellers.length / sellersPerPage);

  const paginatedSellers = filteredSellers.slice(
    currentPage * sellersPerPage,
    (currentPage + 1) * sellersPerPage
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Seller Details
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
              onClick={() => navigate("/SellerDetails")}
              className="px-4 py-2 bg-[#B197FC] hover:bg-[#9a6cd8] text-white font-bold rounded-md"
            >
              Add Seller Details
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
            {paginatedSellers.map(seller => (
              <tr key={seller._id}>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.gstin}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.legal_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.address1}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.location}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.pincode}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {seller.state_code}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(seller._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/SellerDetailsUpdate/${seller._id}`)
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

export default SellerDetailsTable;
