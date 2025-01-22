import React, { useState } from "react";
import { FaFileAlt } from "react-icons/fa"; // Example icon, replace with your preferred icon

function ReferenceDetailsNew() {
  // Dummy data
  const [formData, setFormData] = useState({
    document_period_details: {
      invoice_period_start_date: "2024-01-01",
      invoice_period_end_date: "2024-01-31",
    },
    preceding_document_details: [
      {
        reference_of_original_invoice: "INV12345",
        preceding_invoice_date: "2024-01-10",
      },
      {
        reference_of_original_invoice: "INV67890",
        preceding_invoice_date: "2024-01-20",
      },
    ],
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      document_period_details: {
        ...prevData.document_period_details,
        [name]: value,
      },
    }));
  };

  const handlePrecedingDocChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPrecedingDocs = [...formData.preceding_document_details];
    updatedPrecedingDocs[index] = {
      ...updatedPrecedingDocs[index],
      [name]: value,
    };
    setFormData(prevData => ({
      ...prevData,
      preceding_document_details: updatedPrecedingDocs,
    }));
  };

  const handleUpdate = () => {
    alert("Details updated successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaFileAlt className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h2 className="text-4xl font-bold text-gray-800">
            Reference Details
          </h2>
        </div>
        <hr className="mb-8 border-gray-300" />

        {/* Document Period Details Form */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Document Period Details
          </h3>
          <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-md">
            <label
              className="w-1/3 text-gray-600 text-xl font-semibold"
              htmlFor="invoice_period_start_date"
            >
              Invoice Period Start Date:
            </label>
            <input
              type="date"
              id="invoice_period_start_date"
              name="invoice_period_start_date"
              value={formData.document_period_details.invoice_period_start_date}
              onChange={handleChange}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-md">
            <label
              className="w-1/3 text-gray-600 text-xl font-semibold"
              htmlFor="invoice_period_end_date"
            >
              Invoice Period End Date:
            </label>
            <input
              type="date"
              id="invoice_period_end_date"
              name="invoice_period_end_date"
              value={formData.document_period_details.invoice_period_end_date}
              onChange={handleChange}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Preceding Document Details Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Preceding Document Details
          </h3>
          {formData.preceding_document_details.map((doc, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-md"
            >
              <div className="flex items-center mb-4">
                <label
                  className="w-1/3 text-gray-600 text-xl font-semibold"
                  htmlFor={`reference_of_original_invoice_${index}`}
                >
                  Reference of Original Invoice:
                </label>
                <input
                  type="text"
                  id={`reference_of_original_invoice_${index}`}
                  name="reference_of_original_invoice"
                  value={doc.reference_of_original_invoice}
                  onChange={e => handlePrecedingDocChange(index, e)}
                  className="w-2/3 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex items-center mb-4">
                <label
                  className="w-1/3 text-gray-600 text-xl font-semibold"
                  htmlFor={`preceding_invoice_date_${index}`}
                >
                  Preceding Invoice Date:
                </label>
                <input
                  type="date"
                  id={`preceding_invoice_date_${index}`}
                  name="preceding_invoice_date"
                  value={doc.preceding_invoice_date}
                  onChange={e => handlePrecedingDocChange(index, e)}
                  className="w-2/3 border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          ))}
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
    </div>
  );
}

export default ReferenceDetailsNew;
