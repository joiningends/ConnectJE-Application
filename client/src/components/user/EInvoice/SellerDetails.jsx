import React, { useState } from "react";

function SellerDetails({ data, onUpdate }) {
  const [sellerDetails, setSellerDetails] = useState(data);

  const handleChange = e => {
    const { name, value } = e.target;
    setSellerDetails({ ...sellerDetails, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(sellerDetails); // Trigger the update when the button is clicked
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seller Details</h2>
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <label htmlFor="gstin" className="w-1/3 text-gray-600">
            GSTIN:
          </label>
          <input
            type="text"
            id="gstin"
            name="gstin"
            value={sellerDetails.gstin || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter GSTIN"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="legal_name" className="w-1/3 text-gray-600">
            Legal Name:
          </label>
          <input
            type="text"
            id="legal_name"
            name="legal_name"
            value={sellerDetails.legal_name || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Legal Name"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="address1" className="w-1/3 text-gray-600">
            Address:
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={sellerDetails.address1 || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Address"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="location" className="w-1/3 text-gray-600">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={sellerDetails.location || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Location"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="pincode" className="w-1/3 text-gray-600">
            Pincode:
          </label>
          <input
            type="number"
            id="pincode"
            name="pincode"
            value={sellerDetails.pincode || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Pincode"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="state_code" className="w-1/3 text-gray-600">
            State Code:
          </label>
          <input
            type="text"
            id="state_code"
            name="state_code"
            value={sellerDetails.state_code || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter State Code"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-[#B197FC] text-white rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerDetails;
