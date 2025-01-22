import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { FaEdit, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import contactBook from "../../../assets/contactbook.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactGroup() {
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const type = localStorage.getItem("whatsappuserId");
    setUserType(type);
  }, []);
  const [contactGroups, setContactGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContactGroups = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/sections/users/${userType}`
        );

        setContactGroups(response.data);
      } catch (error) {
        console.error("Error fetching contact groups:", error);
      }
    };

    fetchContactGroups();
  }, [userType]);

  const toggleActiveStatus = async (id, currentStatus, groupName) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`http://localhost:5001/api/v1/sections/active/${id}`, {
        active: newStatus,
      });
      setContactGroups(
        contactGroups.map(group =>
          group._id === id ? { ...group, active: newStatus } : group
        )
      );
      toast.success(
        `Contact group "${groupName}" ${
          newStatus ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error("Error updating active status");
    }
  };

  const filteredGroups = contactGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredGroups.length / groupsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handleAddContactGroup = () => {
    navigate("/createContactGroup");
    toast.info("Navigating to add new contact group");
  };

  const handleEditContactGroup = id => {
    navigate(`/editContactGroup/${id}`);
    toast.info("Navigating to edit contact group");
  };

  const handleAddContact = id => {
    navigate(`/addContact/${id}`);
    toast.info("Navigating to add contact");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Contact Group
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex-grow mr-4">
          <input
            type="text"
            placeholder="Search contact group..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          className="flex items-center px-4 py-2 bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors focus:outline-none"
          title="Add Contact Group"
          onClick={handleAddContactGroup}
          style={{ backgroundColor: "#B197FC" }}
        >
          <FaPlus className="text-xl mr-2" /> Add Contact Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentGroups.map(group => (
          <div
            key={group._id}
            className="flex flex-col items-center justify-between p-6 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
          >
            <div className="flex items-center w-full mb-4">
              <div className="w-16 h-16 mr-4 flex items-center justify-center bg-gray-100 rounded-full">
                <img
                  src={contactBook}
                  alt="Contact Book"
                  className="w-12 h-12"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700">
                  {group.name}
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-gray-600">Contacts: {group.count}</div>
              <div className="flex items-center space-x-2">
                <button
                  className="focus:outline-none"
                  title="Add Phone Numbers"
                  onClick={() => handleEditContactGroup(group._id)}
                >
                  <FaEdit className="text-blue-500 cursor-pointer text-xl" />
                </button>
                <button
                  onClick={() =>
                    toggleActiveStatus(group._id, group.active, group.name)
                  }
                  className="focus:outline-none"
                  title={
                    group.active ? "Deactivate Contact" : "Activate Contact"
                  }
                >
                  {group.active ? (
                    <FaToggleOn className="text-green-500 text-xl" />
                  ) : (
                    <FaToggleOff className="text-gray-500 text-xl" />
                  )}
                </button>
                <button
                  className="focus:outline-none"
                  title="Add Contact"
                  onClick={() => handleAddContact(group._id)}
                >
                  <FaPlus className="text-green-500 cursor-pointer text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        <a
          href="#"
          className={`mx-1 text-sm font-semibold text-gray-900 ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
          onClick={e => currentPage > 1 && handleClick(e, currentPage - 1)}
          style={{ color: "#B197FC" }}
        >
          ← Previous
        </a>
        {pageNumbers.map(number => (
          <a
            key={number}
            href="#"
            className={`mx-1 flex items-center rounded-md border border-gray-400 px-3 py-1 text-gray-900 hover:scale-105 ${
              currentPage === number ? "bg-purple-300 text-white" : ""
            }`}
            onClick={e => handleClick(e, number)}
            style={{
              borderColor: "#B197FC",
              color: currentPage === number ? "#ffffff" : "#B197FC",
              backgroundColor:
                currentPage === number ? "#B197FC" : "transparent",
            }}
          >
            {number}
          </a>
        ))}
        <a
          href="#"
          className={`mx-2 text-sm font-semibold text-gray-900 ${
            currentPage === pageNumbers.length ? "cursor-not-allowed" : ""
          }`}
          onClick={e =>
            currentPage < pageNumbers.length && handleClick(e, currentPage + 1)
          }
          style={{ color: "#B197FC" }}
        >
          Next →
        </a>
      </div>
    </div>
  );
}

export default ContactGroup;
