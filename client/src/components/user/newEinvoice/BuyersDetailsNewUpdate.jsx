import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosSetup";
import { toast } from "react-toastify";

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

const BuyersDetailsNewUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [buyerData, setBuyerData] = useState({
    name: "",
    gstin: "",
    legal_name: "",
    address1: "",
    location: "",
    pincode: "",
    place_of_supply: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch existing buyer details on component mount
    const fetchBuyerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eibuyer/${id}`
        );
        const data = response.data;
        setBuyerData({
          name: data.name,
          gstin: data.gstin,
          legal_name: data.legal_name,
          address1: data.address1,
          location: data.location,
          pincode: data.pincode,
          place_of_supply: data.place_of_supply,
        });
      } catch (error) {
        toast.error("Failed to fetch buyer details.");
      }
    };

    fetchBuyerDetails();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setBuyerData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let validationErrors = {};

    if (!buyerData.name) {
      validationErrors.name = "Name is required.";
    }

    if (!buyerData.gstin) {
      validationErrors.gstin = "GSTIN is required.";
    } else if (buyerData.gstin.length !== 15) {
      validationErrors.gstin = "GSTIN must be 15 characters long.";
    }

    if (!buyerData.legal_name) {
      validationErrors.legal_name = "Legal Name is required.";
    }

    if (!buyerData.address1) {
      validationErrors.address1 = "Address 1 is required.";
    }

    if (!buyerData.location) {
      validationErrors.location = "Location is required.";
    }

    if (!buyerData.pincode) {
      validationErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(buyerData.pincode)) {
      validationErrors.pincode = "Pincode must be a 6-digit number.";
    }

    if (!buyerData.place_of_supply) {
      validationErrors.place_of_supply = "Place of Supply is required.";
    }

    const selectedStateCode = stateOptions.find(
      state => state.name === buyerData.place_of_supply
    )?.code;
    if (
      selectedStateCode &&
      buyerData.gstin.substring(0, 2) !== selectedStateCode
    ) {
      validationErrors.gstin =
        "GSTIN's first two characters must match the selected state's GST code.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const selectedStateCode = stateOptions.find(
          state => state.name === buyerData.place_of_supply
        )?.code;

        const whatsappUserId = localStorage.getItem("whatsappuserId");
        const postData = {
          user: whatsappUserId, // Replace with actual user ID if needed
          name: buyerData.name,
          gstin: buyerData.gstin,
          legal_name: buyerData.legal_name,
          address1: buyerData.address1,
          location: buyerData.location,
          pincode: buyerData.pincode,
          place_of_supply: buyerData.place_of_supply,
          state_code: selectedStateCode,
        };

        await axios.put(`http://localhost:5001/api/v1/eibuyer/${id}`, postData);
        toast.success("Buyer details updated successfully!");
        navigate("/BuyersDetailsTable");
      } catch (error) {
        toast.error("Failed to update buyer details.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/BuyersDetailsTable");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaUserAlt className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h1 className="text-4xl font-bold text-gray-800">Buyer Details</h1>
        </div>
        <hr className="mb-8 border-gray-300" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Name"
              value={buyerData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* GSTIN */}
          <div>
            <label
              htmlFor="gstin"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              GSTIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="gstin"
              name="gstin"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.gstin ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter GSTIN"
              value={buyerData.gstin}
              onChange={handleChange}
              required
            />
            {errors.gstin && (
              <p className="text-red-500 text-sm">{errors.gstin}</p>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <label
              htmlFor="legal_name"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="legal_name"
              name="legal_name"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.legal_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Legal Name"
              value={buyerData.legal_name}
              onChange={handleChange}
              required
            />
            {errors.legal_name && (
              <p className="text-red-500 text-sm">{errors.legal_name}</p>
            )}
          </div>

          {/* Address 1 */}
          <div>
            <label
              htmlFor="address1"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Address 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.address1 ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Address 1"
              value={buyerData.address1}
              onChange={handleChange}
              required
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
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Location"
              value={buyerData.location}
              onChange={handleChange}
              required
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
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Pincode"
              value={buyerData.pincode}
              onChange={handleChange}
              required
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>

          {/* Place of Supply */}
          <div>
            <label
              htmlFor="place_of_supply"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Place of Supply <span className="text-red-500">*</span>
            </label>
            <select
              id="place_of_supply"
              name="place_of_supply"
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                errors.place_of_supply ? "border-red-500" : "border-gray-300"
              }`}
              value={buyerData.place_of_supply}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {stateOptions.map(state => (
                <option key={state.code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.place_of_supply && (
              <p className="text-red-500 text-sm">{errors.place_of_supply}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#B197FC] text-white font-bold py-2 px-6 rounded-full hover:bg-[#a87df5] focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyersDetailsNewUpdate;
