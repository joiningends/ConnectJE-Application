import React, { useState, useEffect } from "react";

function ItemList({ data, onUpdate }) {
  const [formData, setFormData] = useState(data);

  // Update formData when data prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setFormData(updatedItems);
  };

  const handleUpdate = () => {
    onUpdate(formData);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Item List</h2>

      {formData.map((item, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`item_serial_number_${index}`}
            >
              Item Serial Number:
            </label>
            <input
              type="text"
              id={`item_serial_number_${index}`}
              name="item_serial_number"
              value={item.item_serial_number}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`hsn_code_${index}`}
            >
              HSN Code:
            </label>
            <input
              type="text"
              id={`hsn_code_${index}`}
              name="hsn_code"
              value={item.hsn_code}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`unit_price_${index}`}
            >
              Unit Price:
            </label>
            <input
              type="number"
              id={`unit_price_${index}`}
              name="unit_price"
              value={item.unit_price}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`total_amount_${index}`}
            >
              Total Amount:
            </label>
            <input
              type="number"
              id={`total_amount_${index}`}
              name="total_amount"
              value={item.total_amount}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`assessable_value_${index}`}
            >
              Assessable Value:
            </label>
            <input
              type="number"
              id={`assessable_value_${index}`}
              name="assessable_value"
              value={item.assessable_value}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`gst_rate_${index}`}
            >
              GST Rate:
            </label>
            <input
              type="number"
              id={`gst_rate_${index}`}
              name="gst_rate"
              value={item.gst_rate}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`total_item_value_${index}`}
            >
              Total Item Value:
            </label>
            <input
              type="number"
              id={`total_item_value_${index}`}
              name="total_item_value"
              value={item.total_item_value}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mb-4">
            <label
              className="w-1/3 text-gray-600"
              htmlFor={`batch_name_${index}`}
            >
              Batch Name:
            </label>
            <input
              type="text"
              id={`batch_name_${index}`}
              name="batch_name"
              value={item.batch_details.name}
              onChange={e => handleChange(index, e)}
              className="w-2/3 border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      ))}

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

export default ItemList;
