import React, { useState } from "react";

function DocumentDetailsNew({ data, onUpdate }) {
  const [documentDetails, setDocumentDetails] = useState(data);

  const handleChange = e => {
    const { name, value } = e.target;
    setDocumentDetails({ ...documentDetails, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(documentDetails);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Document Details</h2>

      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <label htmlFor="document_type" className="w-1/3 text-gray-600">
            Document Type:
          </label>
          <input
            type="text"
            id="document_type"
            name="document_type"
            value={documentDetails.document_type || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Document Type"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="document_number" className="w-1/3 text-gray-600">
            Document Number:
          </label>
          <input
            type="text"
            id="document_number"
            name="document_number"
            value={documentDetails.document_number || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
            placeholder="Enter Document Number"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="document_date" className="w-1/3 text-gray-600">
            Document Date:
          </label>
          <input
            type="date"
            id="document_date"
            name="document_date"
            value={documentDetails.document_date || ""}
            onChange={handleChange}
            className="w-2/3 border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-end">
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

export default DocumentDetailsNew;
