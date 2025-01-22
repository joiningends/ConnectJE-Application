import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserCog } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "../../../axiosSetup";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    userType: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Invalid phone number format";
    }
    if (!formData.userType) {
      newErrors.userType = "Please select a user type";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const userId = localStorage.getItem("whatsappuserId");
      const url = `http://localhost:5001/api/v1/role/${userId}`;

      const roleMapping = {
        sales_marketing: "1",
        scanner: "2",
        optometrist: "3",
        partner: "4",
      };

      const data = {
        Name: formData.firstName,
        Email: formData.email,
        Mobile: formData.phoneNumber,
        role: roleMapping[formData.userType],
      };

      try {
        const response = await axios.post(url, data);

        if (response.status === 400) {
          if (
            response.data.message &&
            response.data.message.includes("Email")
          ) {
            toast.error("Email already exists. Please use a different email.");
          } else if (
            response.data.message &&
            response.data.message.includes("Phone")
          ) {
            toast.error(
              "Phone number already exists. Please use a different phone number."
            );
          } else {
            toast.error("Email or phone number already exists.");
          }
        } else if (response.status !== 200 && response.status !== 201) {
          throw new Error("Network response was not ok");
        } else {
          setFormData({
            firstName: "",
            email: "",
            phoneNumber: "",
            userType: "",
          });
          navigate("/AllUsers");
        }
      } catch (error) {
        console.error("Error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                aria-label="First Name"
              />
            </div>
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                aria-label="Email"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.phoneNumber ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                placeholder="1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
                aria-label="Phone Number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-gray-700"
            >
              Select User Type
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserCog className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="userType"
                id="userType"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.userType ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                value={formData.userType}
                onChange={handleChange}
                aria-label="Select User Type"
              >
                <option value="">Select a user type</option>
                <option value="sales_marketing">Sales & Marketing</option>
                <option value="scanner">Scanner</option>
                <option value="optometrist">Optometrist</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            {errors.userType && (
              <p className="mt-2 text-sm text-red-600">{errors.userType}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isLoading ? (
                <>
                  <CgSpinner className="animate-spin h-5 w-5 mr-3" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
