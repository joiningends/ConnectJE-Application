import React, { useState, useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa"; // Example icon, replace with your preferred icon

function ItemListNew() {
  // Dummy data
  const initialData = [
    {
      item_serial_number: "123456",
      hsn_code: "HSN001",
      unit_price: 100,
      total_amount: 1000,
      assessable_value: 950,
      gst_rate: 18,
      total_item_value: 1180,
      batch_name: "Batch001",
    },
    {
      item_serial_number: "654321",
      hsn_code: "HSN002",
      unit_price: 200,
      total_amount: 2000,
      assessable_value: 1900,
      gst_rate: 18,
      total_item_value: 2360,
      batch_name: "Batch002",
    },
  ];

  const [formData, setFormData] = useState(initialData);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData(updatedItems);
  };

  const handleUpdate = () => {
    // Handle update logic here (e.g., log data to console or send to an API)
    console.log("Updated Data:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaBoxOpen className="h-8 w-8 mr-2 text-[#B197FC]" /> {/* Icon added */}
          <h1 className="text-4xl font-bold text-gray-800">Item List</h1>
        </div>
        <hr className="mb-8 border-gray-300" />
        {formData.map((item, index) => (
          <div key={index} className="mb-6 p-6 border border-gray-200 rounded-md">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor={`item_serial_number_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Item Serial Number
                </label>
                <input
                  type="text"
                  id={`item_serial_number_${index}`}
                  name="item_serial_number"
                  value={item.item_serial_number || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Item Serial Number"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`hsn_code_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  HSN Code
                </label>
                <input
                  type="text"
                  id={`hsn_code_${index}`}
                  name="hsn_code"
                  value={item.hsn_code || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter HSN Code"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`unit_price_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Unit Price
                </label>
                <input
                  type="number"
                  id={`unit_price_${index}`}
                  name="unit_price"
                  value={item.unit_price || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Unit Price"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`total_amount_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Total Amount
                </label>
                <input
                  type="number"
                  id={`total_amount_${index}`}
                  name="total_amount"
                  value={item.total_amount || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Total Amount"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`assessable_value_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Assessable Value
                </label>
                <input
                  type="number"
                  id={`assessable_value_${index}`}
                  name="assessable_value"
                  value={item.assessable_value || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Assessable Value"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`gst_rate_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  GST Rate
                </label>
                <input
                  type="number"
                  id={`gst_rate_${index}`}
                  name="gst_rate"
                  value={item.gst_rate || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter GST Rate"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`total_item_value_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Total Item Value
                </label>
                <input
                  type="number"
                  id={`total_item_value_${index}`}
                  name="total_item_value"
                  value={item.total_item_value || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Total Item Value"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`batch_name_${index}`}
                  className="block text-xl font-semibold text-gray-700 mb-2"
                >
                  Batch Name
                </label>
                <input
                  type="text"
                  id={`batch_name_${index}`}
                  name="batch_name"
                  value={item.batch_name || ""}
                  onChange={e => handleChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter Batch Name"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleUpdate}
            className="bg-[#B197FC] hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemListNew;
