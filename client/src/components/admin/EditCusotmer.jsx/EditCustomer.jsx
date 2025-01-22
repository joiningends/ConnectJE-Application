import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    gstNo: "",
    address: "",
    whatsappmodel: { cm: 0, cmf: 0, mt: 0 },
    storagelimit: 0,
    wa: false,
    Wag: false,
    whatsappmodelgroup: { cm: 0, cmf: 0, mt: 0 },
    ei: false,
    einvoicemodel: { gstverification: 0, einvoice: 0, ewaybill: 0 },
    event: false,
    wfb: false, // New field for WhatsApp Facebook Message
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/clients/clients/${id}`)
      .then(response => {
        setCustomerData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching customer data:", error);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = event => {
    const { name, value, type, checked } = event.target;

    // Check if the name corresponds to the nested structure
    const keys = name.split(".");
    if (keys.length === 2) {
      setCustomerData(prevState => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setCustomerData(prevState => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`http://localhost:5001/api/v1/clients/clients/${id}`, customerData)
      .then(() => {
        alert("Customer data updated successfully");
      })
      .catch(error => {
        console.error("Error updating customer data:", error);
      });
  };

  const handleCancel = () => {
    navigate("/allCustomers");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Customer</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={customerData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={customerData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={customerData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                GST Number
              </label>
              <input
                type="text"
                name="gstNo"
                value={customerData.gstNo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={customerData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md h-24"
              />
            </div>

            {/* WhatsApp Profile Allowed Per Client */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                WhatsApp Profile Allowed Per Client
              </label>
              <input
                type="number"
                name="wapc"
                value={customerData.wapc}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Storage Limit (MB) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Storage Limit (MB)
              </label>
              <input
                type="number"
                name="storagelimit"
                value={customerData.storagelimit}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Enable WhatsApp Single Message */}
            <div className="col-span-2">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="wa"
                    checked={customerData.wa}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label className="ml-2 text-gray-700">
                    Enable WhatsApp Single Message
                  </label>
                </div>

                {customerData.wa && (
                  <>
                    {/* Credit for Message Only */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for Message Only
                      </label>
                      <input
                        type="number"
                        name="whatsappmodel.cm"
                        value={customerData.whatsappmodel.cm || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Credit for Attachment Only */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for Attachment Only
                      </label>
                      <input
                        type="number"
                        name="whatsappmodel.cmf"
                        value={customerData.whatsappmodel.cmf || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Minimum Threshold */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Minimum Threshold
                      </label>
                      <input
                        type="number"
                        name="whatsappmodel.mt"
                        value={customerData.whatsappmodel.mt || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enable WhatsApp Group Message */}
            <div className="col-span-2">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="Wag"
                    checked={customerData.Wag}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label className="ml-2 text-gray-700">
                    Enable WhatsApp Group Message
                  </label>
                </div>

                {customerData.Wag && (
                  <>
                    {/* Credit for Group Message Only */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for Group Message Only
                      </label>
                      <input
                        type="number"
                        name="whatsappmodelgroup.cm"
                        value={customerData.whatsappmodelgroup.cm || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Credit for Group Attachment Only */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for Group Attachment Only
                      </label>
                      <input
                        type="number"
                        name="whatsappmodelgroup.cmf"
                        value={customerData.whatsappmodelgroup.cmf || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Minimum Threshold Group */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Minimum Threshold Group
                      </label>
                      <input
                        type="number"
                        name="whatsappmodelgroup.mt"
                        value={customerData.whatsappmodelgroup.mt || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enable E-Invoice/E-Waybill */}
            <div className="col-span-2">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="ei"
                    checked={customerData.ei}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label className="ml-2 text-gray-700">
                    Enable E-Invoice/E-Waybill
                  </label>
                </div>

                {customerData.ei && (
                  <>
                    {/* Credit for GST Verification */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for GST Verification
                      </label>
                      <input
                        type="number"
                        name="einvoicemodel.gstverification"
                        value={customerData.einvoicemodel.gstverification || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Credit for E-Invoice */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for E-Invoice
                      </label>
                      <input
                        type="number"
                        name="einvoicemodel.einvoice"
                        value={customerData.einvoicemodel.einvoice || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Credit for E-Waybill */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Credit for E-Waybill
                      </label>
                      <input
                        type="number"
                        name="einvoicemodel.ewaybill"
                        value={customerData.einvoicemodel.ewaybill || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Event */}
            <div className="col-span-2">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="event"
                    checked={customerData.event}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label className="ml-2 text-gray-700">Event</label>
                </div>
              </div>
            </div>

            {/* WhatsApp Facebook Message */}
            <div className="col-span-2">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="wfb"
                    checked={customerData.wfb}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label className="ml-2 text-gray-700">
                    WhatsApp Facebook Message
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#512da8",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
              }}
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCustomer;
