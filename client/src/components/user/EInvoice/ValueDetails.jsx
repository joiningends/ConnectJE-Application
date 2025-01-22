import React, { useState, useEffect } from "react";

function ValueDetails({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Update formData when data prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate(formData);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Value Details</h2>

      <div className="mb-6">
        <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-md">
          <label
            className="w-1/3 text-gray-600"
            htmlFor="total_assessable_value"
          >
            Total Assessable Value:
          </label>
          <input
            type="number"
            id="total_assessable_value"
            name="total_assessable_value"
            value={formData.total_assessable_value}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-md">
          <label className="w-1/3 text-gray-600" htmlFor="total_invoice_value">
            Total Invoice Value:
          </label>
          <input
            type="number"
            id="total_invoice_value"
            name="total_invoice_value"
            value={formData.total_invoice_value}
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

export default ValueDetails;
