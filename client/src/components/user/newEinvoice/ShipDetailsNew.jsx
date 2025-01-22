import axios from "../../../axiosSetup";
import React, { useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// List of Indian states and their GST codes
const states = [
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

function ShipDetailsNew() {
  const navigate = useNavigate();
  const [shipDetails, setShipDetails] = useState({
    name: "",
    legal_name: "",
    address1: "",
    location: "",
    pincode: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setShipDetails({
      ...shipDetails,
      [name]: value,
    });
  };

  const validate = () => {
    let validationErrors = {};

    if (!shipDetails.name) {
      validationErrors.name = "Name is required.";
    }

    if (!shipDetails.legal_name) {
      validationErrors.legal_name = "Legal Name is required.";
    }

    if (!shipDetails.address1) {
      validationErrors.address1 = "Address is required.";
    }

    if (!shipDetails.location) {
      validationErrors.location = "Location is required.";
    }

    if (!shipDetails.pincode) {
      validationErrors.pincode = "Pincode is required.";
    } else if (shipDetails.pincode.length !== 6) {
      validationErrors.pincode = "Pincode must be 6 digits long.";
    }

    if (!shipDetails.state) {
      validationErrors.state = "State is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      const whatsappUserId = localStorage.getItem("whatsappuserId");

      try {
        const response = await axios.post(
          "http://localhost:5001/api/v1/eiship",
          {
            user: whatsappUserId,
            name: shipDetails.name,
            legal_name: shipDetails.legal_name,
            address1: shipDetails.address1,
            location: shipDetails.location,
            pincode: shipDetails.pincode,
            state_code: states.find(state => state.name === shipDetails.state)
              .code,
          }
        );

        navigate("/ShipDetailsTable");
      } catch (error) {
        console.error("Error submitting ship details:", error);
        alert("An error occurred. Please try again.");
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
          <h2 className="text-4xl font-bold text-gray-800">Ship Details</h2>
        </div>
        <hr className="mb-8 border-gray-300" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-600"
            >
              Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shipDetails.name}
              onChange={handleChange}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <label
              htmlFor="legal_name"
              className="block text-xl font-semibold text-gray-600"
            >
              Legal Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="legal_name"
              name="legal_name"
              value={shipDetails.legal_name}
              onChange={handleChange}
              className={`w-full border ${
                errors.legal_name ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
              placeholder="Enter Legal Name"
            />
            {errors.legal_name && (
              <p className="text-red-500 text-sm">{errors.legal_name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address1"
              className="block text-xl font-semibold text-gray-600"
            >
              Address: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={shipDetails.address1}
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
              className="block text-xl font-semibold text-gray-600"
            >
              Location: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={shipDetails.location}
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
              className="block text-xl font-semibold text-gray-600"
            >
              Pincode: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={shipDetails.pincode}
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
              htmlFor="state"
              className="block text-xl font-semibold text-gray-600"
            >
              State: <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              value={shipDetails.state}
              onChange={handleChange}
              className={`w-full border ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-md p-2`}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={() => navigate("/ShipDetailsTable")}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#B197FC] hover:bg-purple-700 text-white font-bold rounded-md"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShipDetailsNew;
