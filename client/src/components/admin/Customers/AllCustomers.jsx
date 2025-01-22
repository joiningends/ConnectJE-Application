import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "../../../axiosSetup";

const ITEMS_PER_PAGE = 8;

export default function AllCustomers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [credit, setCredit] = useState("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Replace fetch with axios for GET request
        const response = await axios.get(
          "http://localhost:5001/api/v1/clients"
        );
        setCustomers(response.data);
        setFilteredCustomers(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      customer =>
        customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, customers]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const handleClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openModal = customerId => {
    setSelectedCustomerId(customerId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCredit("");
  };

  const openDeleteModal = customerId => {
    setDeleteCustomerId(customerId);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setDeleteCustomerId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = {
      clientId: selectedCustomerId,
      date: new Date().toISOString(),
      value: Number(credit),
      by: "admin", // Adjust this as necessary
    };

    console.log(data);
    try {
      // Replace fetch with axios for PUT request
      const response = await axios.put(
        "http://localhost:5001/api/v1/clients/updateTotalCredit",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Credit added successfully");
        // Optionally, you can refresh the customer list or update state here
      } else {
        console.error("Failed to add credit");
      }

      // Replace fetch with axios for GET request
      const clientsResponse = await axios.get(
        "http://localhost:5001/api/v1/clients"
      );
      setCustomers(clientsResponse.data);
      setFilteredCustomers(clientsResponse.data);
      setLoading(false);
      console.log(clientsResponse.data);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }

    closeModal();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/v1/clients/clients/${deleteCustomerId}`
      );

      if (response.status === 200 || response.status === 204) {
        console.log("Customer deleted successfully");
        setCustomers(
          customers.filter(customer => customer._id !== deleteCustomerId)
        );
        setFilteredCustomers(
          filteredCustomers.filter(
            customer => customer._id !== deleteCustomerId
          )
        );
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    closeDeleteModal();
  };

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-4 mt-10 bg-white border border-gray-300 rounded-md shadow-md">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">All Customers</h2>
            <p className="mt-1 text-sm text-gray-700">
              This is a list of all customers. You can add new customers, edit
              or delete existing ones.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => navigate("/CreateCustomer")}
            >
              Add new customer
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center space-x-4">
            <span className="loading loading-spinner loading-xs"></span>
            <span className="loading loading-spinner loading-sm"></span>
            <span className="loading loading-spinner loading-md"></span>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span>Name</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Mobile
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Client Id
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          Credit Balance
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span className="sr-only">Add Credit</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span className="sr-only">See Campaign</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span className="sr-only">See Report</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                        >
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedCustomers.map(customer => (
                        <tr key={customer._id}>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer?.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="text-sm text-gray-700">
                              {customer?.mobile}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="text-sm text-gray-700">
                              {customer?.email}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="text-sm text-gray-700">
                              {customer?._id}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="text-sm text-gray-700">
                              {customer?.Totalcredit}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => openModal(customer._id)}
                            >
                              Add Credit
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() =>
                                navigate(`/campaigns/${customer._id}`)
                              }
                            >
                              See Campaign
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <button
                              className="text-gray-700 hover:text-gray-900"
                              onClick={() =>
                                navigate(`/EditCreateCustomer/${customer._id}`)
                              }
                            >
                              Edit
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <button
                              type="button"
                              className="inline-block rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 focus:bg-blue-700"
                              onClick={() =>
                                navigate(`/Report/${customer._id}`)
                              }
                            >
                              See Report
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => openDeleteModal(customer._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && (
          <div className="flex items-center justify-center pt-6">
            <button
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mx-1 text-sm font-semibold text-gray-900 ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="hidden lg:block">&larr; Previous</span>
              <span className="block lg:hidden">&larr;</span>
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handleClick(index + 1)}
                className={`mx-1 flex items-center rounded-md border border-gray-400 px-3 py-1 text-gray-900 hover:scale-105 ${
                  currentPage === index + 1 ? "bg-gray-200" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`mx-1 text-sm font-semibold text-gray-900 ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="hidden lg:block">Next &rarr;</span>
              <span className="block lg:hidden">&rarr;</span>
            </button>
          </div>
        )}
      </section>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Credit"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add Credit</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="text"
                value={formattedDate}
                readOnly
                className="mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Credit</label>
              <input
                type="number"
                value={credit}
                onChange={e => setCredit(e.target.value)}
                className="mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Customer"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this customer?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
