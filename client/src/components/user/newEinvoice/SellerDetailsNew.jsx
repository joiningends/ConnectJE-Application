import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Spinner icon
import axios from "../../../axiosSetup";

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

const SellerDetailsNew = () => {
  const navigate = useNavigate();
  const [sellerDetails, setSellerDetails] = useState({
    name: "",
    gstin: "",
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
    setSellerDetails({ ...sellerDetails, [name]: value });
  };

  const handleStateChange = e => {
    const selectedState = states.find(state => state.code === e.target.value);
    setSellerDetails({ ...sellerDetails, state: selectedState });
  };

  const validate = () => {
    let validationErrors = {};

    if (!sellerDetails.name) {
      validationErrors.name = "Name is required.";
    }

    if (!sellerDetails.gstin) {
      validationErrors.gstin = "GSTIN is required.";
    } else if (sellerDetails.gstin.length !== 15) {
      validationErrors.gstin = "GSTIN must be 15 characters long.";
    }

    if (
      sellerDetails.state &&
      sellerDetails.gstin.substring(0, 2) !== sellerDetails.state.code
    ) {
      validationErrors.gstin =
        "GSTIN's first two characters must be equal to the selected state's GST code.";
    }

    if (!sellerDetails.legal_name) {
      validationErrors.legal_name = "Legal Name is required.";
    }

    if (!sellerDetails.address1) {
      validationErrors.address1 = "Address is required.";
    }

    if (!sellerDetails.location) {
      validationErrors.location = "Location is required.";
    }

    if (!sellerDetails.pincode) {
      validationErrors.pincode = "Pincode is required.";
    } else if (sellerDetails.pincode.length !== 6) {
      validationErrors.pincode = "Pincode must be 6 digits long.";
    }

    if (!sellerDetails.state) {
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
          "http://localhost:5001/api/v1/eiseller",
          {
            user: whatsappUserId,
            name: sellerDetails.name,
            gstin: sellerDetails.gstin,
            legal_name: sellerDetails.legal_name,
            address1: sellerDetails.address1,
            location: sellerDetails.location,
            pincode: sellerDetails.pincode,
            state_code: sellerDetails.state.code,
          }
        );

        if (response.status === 200 || response.status === 201) {
          navigate("/SellerTable");
        } else {
          alert("Failed to submit seller details.");
        }
      } catch (error) {
        console.error("Error submitting seller details:", error);
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
          <FaUserTie className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h2 className="text-4xl font-bold text-gray-800">Seller Details</h2>
        </div>
        <hr className="mb-8 border-gray-300" />

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xl font-semibold text-gray-600">
                Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={sellerDetails.name}
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

            {/* GSTIN */}
            <div>
              <label className="block text-xl font-semibold text-gray-600">
                GSTIN: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="gstin"
                value={sellerDetails.gstin}
                onChange={handleChange}
                className={`w-full border ${
                  errors.gstin ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
                placeholder="Enter GSTIN"
              />
              {errors.gstin && (
                <p className="text-red-500 text-sm">{errors.gstin}</p>
              )}
            </div>

            {/* Legal Name */}
            <div>
              <label className="block text-xl font-semibold text-gray-600">
                Legal Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="legal_name"
                value={sellerDetails.legal_name}
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
              <label className="block text-xl font-semibold text-gray-600">
                Address: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address1"
                value={sellerDetails.address1}
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
              <label className="block text-xl font-semibold text-gray-600">
                Location: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={sellerDetails.location}
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
              <label className="block text-xl font-semibold text-gray-600">
                Pincode: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={sellerDetails.pincode}
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
              <label className="block text-xl font-semibold text-gray-600">
                State: <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={sellerDetails.state.code}
                onChange={handleStateChange}
                className={`w-full border ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/SellerTable")}
              className="bg-gray-500 text-white text-xl font-semibold py-2 px-6 rounded-md hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#B197FC] text-white text-xl font-semibold py-2 px-6 rounded-md hover:bg-[#9771fc] flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
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

export default SellerDetailsNew;
