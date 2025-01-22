import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa"; // Example icon, replace with your preferred icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ValueDetailsNew() {
  // Dummy data
  const [formData, setFormData] = useState({
    total_assessable_value: 0,
    total_invoice_value: 0,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    toast.success("Details updated successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaInfoCircle className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h2 className="text-4xl font-bold text-gray-800">Value Details</h2>
        </div>
        <hr className="mb-8 border-gray-300" />
        <div className="mb-6">
          <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-md">
            <label
              className="w-1/3 text-gray-600 text-xl font-semibold"
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
            <label
              className="w-1/3 text-gray-600 text-xl font-semibold"
              htmlFor="total_invoice_value"
            >
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
            className="px-4 py-2 bg-[#B197FC] hover:bg-purple-700 text-white font-bold rounded-md"
          >
            Update
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default ValueDetailsNew;
