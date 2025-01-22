import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const usersPerPage = 10;

  // Role mapping
  const roleMapping = {
    1: "Sales Marketing",
    2: "Scanner",
    3: "Optometrist",
    4: "Partner",
  };

  // Fetch users from API based on userId from localStorage
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const userId = localStorage.getItem("whatsappuserId");

        if (userId) {
          // API call to get users with roles
          const response = await axios.get(
            `http://localhost:5001/api/v1/role/${userId}`
          );

          // Check if response structure is as expected
          if (response.data && response.data.roles) {
            setUsers(response.data.roles); // Use "roles" from the response
          } else {
            throw new Error("Invalid API response structure.");
          }
        } else {
          throw new Error("No user data in localStorage.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserRoles();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    .filter(
      user =>
        user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Mobile?.includes(searchTerm)
    )
    .slice(indexOfFirstUser, indexOfLastUser);

  console.log(currentUsers);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleViewUser = id => {
    navigate(`/EditView/${id}`);
  };

  const handleAddUser = () => {
    navigate("/AddUser");
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            color: "#B197FC",
            fontSize: "36px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Users
        </h1>
        <button
          style={{
            backgroundColor: "#B197FC",
            color: "white",
            border: "none",
            padding: "12px 25px",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          border: "2px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      />

      {/* Error handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Users Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                backgroundColor: "#B197FC",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              S.No
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                backgroundColor: "#B197FC",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                backgroundColor: "#B197FC",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Email
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                backgroundColor: "#B197FC",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Phone Number
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                backgroundColor: "#B197FC",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user._id}>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                {indexOfFirstUser + index + 1}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  fontSize: "14px",
                }}
              >
                {user.Name}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  fontSize: "14px",
                }}
              >
                {user.Email}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  fontSize: "14px",
                }}
              >
                {user.Mobile}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  fontSize: "14px",
                }}
              >
                {roleMapping[user.role] || "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page + 1)}
            style={{
              backgroundColor: currentPage === page + 1 ? "#9b83e2" : "#B197FC",
              color: "white",
              padding: "10px 20px",
              border: "none",
              margin: "0 5px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
