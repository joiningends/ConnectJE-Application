import React, { useState } from "react";

function BuyerDetails({ data, onUpdate }) {
  const [buyerData, setBuyerData] = useState(data);

  const handleChange = e => {
    const { name, value } = e.target;
    setBuyerData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onUpdate(buyerData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Buyer Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center mb-4">
          <label htmlFor="gstin" className="w-1/3 text-gray-600">
            GSTIN:
          </label>
          <input
            type="text"
            id="gstin"
            name="gstin"
            className="w-2/3 border border-gray-300 rounded-md p-2"
            value={buyerData.gstin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="legalName" className="w-1/3 text-gray-600">
            Legal Name:
          </label>
          <input
            type="text"
            id="legalName"
            name="legal_name"
            className="w-2/3 border border-gray-300 rounded-md p-2"
            value={buyerData.legal_name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="address1" className="w-1/3 text-gray-600">
            Address 1:
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            className="w-2/3 border border-gray-300 rounded-md p-2"
            value={buyerData.address1 || ""}
            onChange={handleChange}
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
            className="w-2/3 border border-gray-300 rounded-md p-2"
            value={buyerData.location || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="placeOfSupply" className="w-1/3 text-gray-600">
            Place of Supply:
          </label>
          <input
            type="text"
            id="placeOfSupply"
            name="place_of_supply"
            className="w-2/3 border border-gray-300 rounded-md p-2"
            value={buyerData.place_of_supply || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#B197FC] text-white rounded-md"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default BuyerDetails;
