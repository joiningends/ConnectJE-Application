import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShippingFast } from "react-icons/fa";
import axios from "../../../axiosSetup"; // Import axios for making HTTP requests
import { toast } from "react-toastify"; // Import toast for notifications

const stateOptions = [
  { name: "Jammu and Kashmir", code: "01" },
  { name: "Himachal Pradesh", code: "02" },
  { name: "Punjab", code: "03" },
  { name: "Chandigarh", code: "04" },
  { name: "Uttarakhand", code: "05" },
  { name: "Haryana", code: "06" },
  { name: "Delhi", code: "07" },
  { name: "Rajasthan", code: "08" },
  { name: "Uttar Pradesh", code: "09" },
  { name: "Bihar", code: "10" },
  { name: "Sikkim", code: "11" },
  { name: "Arunachal Pradesh", code: "12" },
  { name: "Nagaland", code: "13" },
  { name: "Manipur", code: "14" },
  { name: "Mizoram", code: "15" },
  { name: "Tripura", code: "16" },
  { name: "Meghalaya", code: "17" },
  { name: "Assam", code: "18" },
  { name: "West Bengal", code: "19" },
  { name: "Jharkhand", code: "20" },
  { name: "Odisha", code: "21" },
  { name: "Chattisgarh", code: "22" },
  { name: "Madhya Pradesh", code: "23" },
  { name: "Gujarat", code: "24" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "26" },
  { name: "Maharashtra", code: "27" },
  { name: "Karnataka", code: "29" },
  { name: "Goa", code: "30" },
  { name: "Lakshadweep", code: "31" },
  { name: "Kerala", code: "32" },
  { name: "Tamil Nadu", code: "33" },
  { name: "Puducherry", code: "34" },
  { name: "Andaman and Nicobar Islands", code: "35" },
  { name: "Telangana", code: "36" },
  { name: "Andhra Pradesh", code: "37" },
  { name: "Ladakh", code: "38" },
  { name: "Other Territory", code: "97" },
  { name: "Centre Jurisdiction", code: "99" },
];

const DispatchDetailsNew = () => {
  const navigate = useNavigate();
  const [dispatchDetails, setDispatchDetails] = useState({
    name: "Dispatch-1",
    company_name: "",
    address1: "",
    location: "",
    pincode: "",
    state_code: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setDispatchDetails({ ...dispatchDetails, [name]: value });
  };

  const validate = () => {
    let validationErrors = {};

    if (!dispatchDetails.company_name) {
      validationErrors.company_name = "Company Name is required.";
    }

    if (!dispatchDetails.address1) {
      validationErrors.address1 = "Address is required.";
    }

    if (!dispatchDetails.location) {
      validationErrors.location = "Location is required.";
    }

    if (!dispatchDetails.pincode) {
      validationErrors.pincode = "Pincode is required.";
    } else if (dispatchDetails.pincode.length !== 6) {
      validationErrors.pincode = "Pincode must be 6 digits long.";
    }

    if (!dispatchDetails.state_code) {
      validationErrors.state_code = "State is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const whatsappUserId = localStorage.getItem("whatsappuserId");
        const payload = {
          user: whatsappUserId, // Assuming this is static for now
          ...dispatchDetails,
        };

        const response = await axios.post(
          "http://localhost:5001/api/v1/eidispatch",
          payload
        );

        toast.success("Dispatch details submitted successfully!");
        navigate("/DispatchDetailsTable");
      } catch (error) {
        toast.error("Failed to submit dispatch details. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaShippingFast className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h2 className="text-4xl font-bold text-gray-800">Dispatch Details</h2>
        </div>
        <hr className="mb-8 border-gray-300" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              htmlFor="company_name"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={dispatchDetails.company_name}
              onChange={handleChange}
              className={`w-full border ${
                errors.company_name ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Company Name"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm">{errors.company_name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address1"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={dispatchDetails.address1}
              onChange={handleChange}
              className={`w-full border ${
                errors.address1 ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Address"
            />
            {errors.address1 && (
              <p className="text-red-500 text-sm">{errors.address1}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={dispatchDetails.location}
              onChange={handleChange}
              className={`w-full border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label
              htmlFor="pincode"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={dispatchDetails.pincode}
              onChange={handleChange}
              className={`w-full border ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Pincode"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state_code"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state_code"
              name="state_code"
              value={dispatchDetails.state_code}
              onChange={handleChange}
              className={`w-full border ${
                errors.state_code ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
            >
              <option value="">Select State</option>
              {stateOptions.map(state => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state_code && (
              <p className="text-red-500 text-sm">{errors.state_code}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/DispatchDetailsTable")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B197FC] hover:bg-purple-700 text-white font-bold rounded-md flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
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

export default DispatchDetailsNew;
