import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [whatsappChecked, setWhatsappChecked] = useState(false);
  const [eOptionsChecked, setEOptionsChecked] = useState(false);
  const [whatsappGroupChecked, setWhatsappGroupChecked] = useState(false);
  const [wfbChecked, setWfbChecked] = useState(false); // New state for WhatsApp Facebook Message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    gstNo: "",
    address: "",
    wapc: "",
    creditForMessageOnly: "",
    creditForAttachmentOnly: "",
    minimumThreshold: "",
    creditForMessageOnlyGroup: "",
    creditForAttachmentOnlyGroup: "",
    minimumThresholdGroup: "",
    storagelimit: "",
    eOption: "",
    creditForGSTVerification: "",
    creditForEInvoice: "",
    creditForEWaybill: "",
  });
  const [eInvoiceChecked, setEInvoiceChecked] = useState(false);
  const [eventChecked, setEventChecked] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handlePhoneChange = value => {
    setFormData({
      ...formData,
      mobile: value,
    });
    if (errors.mobile) {
      setErrors({
        ...errors,
        mobile: "",
      });
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email";
    }
    if (!formData.mobile) validationErrors.mobile = "Mobile number is required";
    if (!formData.companyName)
      validationErrors.companyName = "Company name is required";
    if (!formData.gstNo) validationErrors.gstNo = "GST number is required";
    if (!formData.address) validationErrors.address = "Address is required";
    if (!formData.wapc)
      validationErrors.address =
        "WhatsApp profile allowed per client is required";
    if (!formData.storageLimit)
      validationErrors.storageLimit = "Storage limit is required";

    return validationErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        companyName: formData.companyName,
        gstNo: formData.gstNo,
        address: formData.address,
        wapc: formData.wapc,
        wa: whatsappChecked,
        eiw: eOptionsChecked,
        Wag: whatsappGroupChecked,
        wfb: wfbChecked, // Add the new WhatsApp Facebook Message checkbox state
        whatsappmodel: {
          cm: formData.creditForMessageOnly,
          cmf: formData.creditForAttachmentOnly,
          mt: formData.minimumThreshold,
        },
        whatsappmodelgroup: whatsappGroupChecked
          ? {
              cm: formData.creditForMessageOnlyGroup,
              cmf: formData.creditForAttachmentOnlyGroup,
              mt: formData.minimumThresholdGroup,
            }
          : {},
        storagelimit: formData.storageLimit,
        ei: eInvoiceChecked,
        event: eventChecked,
        einvoicemodel: eInvoiceChecked
          ? {
              gstverification: formData.creditForGSTVerification,
              einvoice: formData.creditForEInvoice,
              ewaybill: formData.creditForEWaybill,
            }
          : {},
      };

      console.log(payload);
      try {
        const response = await axios.post(
          "http://localhost:5001/api/v1/clients",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Form submitted successfully:", response.data);
          navigate("/allCustomers");
        } else {
          console.error("Form submission failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      companyName: "",
      gstNo: "",
      address: "",
      creditForMessageOnly: "",
      creditForAttachmentOnly: "",
      minimumThreshold: "",
      creditForMessageOnlyGroup: "",
      creditForAttachmentOnlyGroup: "",
      minimumThresholdGroup: "",
      storageLimit: "",
      wapc: "",
      eOption: "",
    });

    setErrors({});
    navigate("/allCustomers");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="space-y-8 p-6 bg-white shadow sm:rounded-lg border border-gray-300 max-w-7xl w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-gray-900">
          Create Customer
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <PhoneInput
              country={"in"}
              value={formData.mobile}
              onChange={handlePhoneChange}
              inputClass={`input input-bordered w-full mt-1 p-2 border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              autoComplete="organization"
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gstNo"
              className="block text-sm font-medium text-gray-700"
            >
              GST Number
            </label>
            <input
              type="text"
              name="gstNo"
              id="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.gstNo ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.gstNo && (
              <p className="text-red-500 text-sm">{errors.gstNo}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
              placeholder="Type here"
              rows={4}
              className={`textarea textarea-bordered w-full mt-1 p-2 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="storageLimit"
              className="block text-sm font-medium text-gray-700"
            >
              WhatsApp profile allowed per client
            </label>
            <input
              type="number"
              name="wapc"
              id="wapc"
              value={formData.wapc}
              onChange={handleChange}
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.wapc ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.wapc && (
              <p className="text-red-500 text-sm">{errors.wapc}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="storageLimit"
              className="block text-sm font-medium text-gray-700"
            >
              Storage Limit (MB)
            </label>
            <input
              type="number"
              name="storageLimit"
              id="storageLimit"
              value={formData.storageLimit}
              onChange={handleChange}
              placeholder="Type here"
              className={`input input-bordered w-full mt-1 p-2 border ${
                errors.storageLimit ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.storageLimit && (
              <p className="text-red-500 text-sm">{errors.storageLimit}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="whatsappChecked"
              className="block text-sm font-medium text-gray-700"
            >
              Enable WhatsApp Single Message
            </label>
            <input
              type="checkbox"
              name="whatsappChecked"
              id="whatsappChecked"
              checked={whatsappChecked}
              onChange={() => setWhatsappChecked(!whatsappChecked)}
              className="checkbox checkbox-primary"
            />
          </div>

          {whatsappChecked && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="creditForMessageOnly"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for Message Only
                </label>
                <input
                  type="number"
                  name="creditForMessageOnly"
                  id="creditForMessageOnly"
                  value={formData.creditForMessageOnly}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForMessageOnly
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForMessageOnly && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForMessageOnly}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="creditForAttachmentOnly"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for Attachment Only
                </label>
                <input
                  type="number"
                  name="creditForAttachmentOnly"
                  id="creditForAttachmentOnly"
                  value={formData.creditForAttachmentOnly}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForAttachmentOnly
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForAttachmentOnly && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForAttachmentOnly}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="minimumThreshold"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Threshold
                </label>
                <input
                  type="number"
                  name="minimumThreshold"
                  id="minimumThreshold"
                  value={formData.minimumThreshold}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.minimumThreshold
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.minimumThreshold && (
                  <p className="text-red-500 text-sm">
                    {errors.minimumThreshold}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="whatsappGroupChecked"
              className="block text-sm font-medium text-gray-700"
            >
              Enable WhatsApp Group Message
            </label>
            <input
              type="checkbox"
              name="whatsappGroupChecked"
              id="whatsappGroupChecked"
              checked={whatsappGroupChecked}
              onChange={() => setWhatsappGroupChecked(!whatsappGroupChecked)}
              className="checkbox checkbox-primary"
            />
          </div>

          {whatsappGroupChecked && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="creditForMessageOnlyGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for Group Message Only
                </label>
                <input
                  type="number"
                  name="creditForMessageOnlyGroup"
                  id="creditForMessageOnlyGroup"
                  value={formData.creditForMessageOnlyGroup}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForMessageOnlyGroup
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForMessageOnlyGroup && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForMessageOnlyGroup}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="creditForAttachmentOnlyGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for Group Attachment Only
                </label>
                <input
                  type="number"
                  name="creditForAttachmentOnlyGroup"
                  id="creditForAttachmentOnlyGroup"
                  value={formData.creditForAttachmentOnlyGroup}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForAttachmentOnlyGroup
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForAttachmentOnlyGroup && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForAttachmentOnlyGroup}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="minimumThresholdGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Group Threshold
                </label>
                <input
                  type="number"
                  name="minimumThresholdGroup"
                  id="minimumThresholdGroup"
                  value={formData.minimumThresholdGroup}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.minimumThresholdGroup
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.minimumThresholdGroup && (
                  <p className="text-red-500 text-sm">
                    {errors.minimumThresholdGroup}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="eInvoiceChecked"
              className="block text-sm font-medium text-gray-700"
            >
              Enable E-Invoice/E-Waybill
            </label>
            <input
              type="checkbox"
              name="eInvoiceChecked"
              id="eInvoiceChecked"
              checked={eInvoiceChecked}
              onChange={() => setEInvoiceChecked(!eInvoiceChecked)}
              className="checkbox checkbox-primary"
            />
          </div>

          {eInvoiceChecked && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="creditForGSTVerification"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for GST Verification
                </label>
                <input
                  type="number"
                  name="creditForGSTVerification"
                  id="creditForGSTVerification"
                  value={formData.creditForGSTVerification}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForGSTVerification
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForGSTVerification && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForGSTVerification}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="creditForEInvoice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for E-Invoice
                </label>
                <input
                  type="number"
                  name="creditForEInvoice"
                  id="creditForEInvoice"
                  value={formData.creditForEInvoice}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForEInvoice
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForEInvoice && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForEInvoice}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="creditForEWaybill"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit for E-Waybill
                </label>
                <input
                  type="number"
                  name="creditForEWaybill"
                  id="creditForEWaybill"
                  value={formData.creditForEWaybill}
                  onChange={handleChange}
                  placeholder="Type here"
                  className={`input input-bordered w-full mt-1 p-2 border ${
                    errors.creditForEWaybill
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md`}
                />
                {errors.creditForEWaybill && (
                  <p className="text-red-500 text-sm">
                    {errors.creditForEWaybill}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="eventChecked"
              className="block text-sm font-medium text-gray-700"
            >
              Event
            </label>
            <input
              type="checkbox"
              name="eventChecked"
              id="eventChecked"
              checked={eventChecked}
              onChange={() => setEventChecked(!eventChecked)}
              className="checkbox checkbox-primary"
            />
          </div>

          {/* New WhatsApp Facebook Message checkbox */}
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="wfbChecked"
              className="block text-sm font-medium text-gray-700"
            >
              WhatsApp Facebook Message
            </label>
            <input
              type="checkbox"
              name="wfbChecked"
              id="wfbChecked"
              checked={wfbChecked}
              onChange={() => setWfbChecked(!wfbChecked)}
              className="checkbox checkbox-primary"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
