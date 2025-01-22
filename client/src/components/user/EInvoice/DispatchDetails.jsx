import React, { useState } from "react";

function DispatchDetails({ data, onUpdate }) {
  const [dispatchDetails, setDispatchDetails] = useState(data);

  const handleChange = e => {
    const { name, value } = e.target;
    setDispatchDetails({
      ...dispatchDetails,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    onUpdate(dispatchDetails);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Dispatch Details
      </h2>

      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <div className="flex items-center mb-4">
          <label className="w-1/3 text-gray-600" htmlFor="company_name">
            Company Name:
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={dispatchDetails.company_name}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center mb-4">
          <label className="w-1/3 text-gray-600" htmlFor="address1">
            Address:
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={dispatchDetails.address1}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center mb-4">
          <label className="w-1/3 text-gray-600" htmlFor="location">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={dispatchDetails.location}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center mb-4">
          <label className="w-1/3 text-gray-600" htmlFor="pincode">
            Pincode:
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={dispatchDetails.pincode}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center mb-4">
          <label className="w-1/3 text-gray-600" htmlFor="state_code">
            State Code:
          </label>
          <input
            type="text"
            id="state_code"
            name="state_code"
            value={dispatchDetails.state_code}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>
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
  );
}

export default DispatchDetails;
