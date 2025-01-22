import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { FaTrash } from "react-icons/fa";

const EditApprovePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    paymentCollection: "no",
    paymentMethod: "",
    amount: "",
    clientRazorpayKey: "",
    clientRazorpaySecret: "",
    linkedAccountId: "",
    numberOfCounters: "",
    maxParticipationPerCounter: "",
    sessionTimeHours: "",
    sessionTimeMinutes: "",
    whoWillBePresent: [],
    personName: "",
    personEmail: "",
    instruments: [],
    instrument: "",
    customFields: [
      { name: "Name", type: "text", isDummy: true },
      { name: "Email", type: "email", isDummy: true },
      { name: "Phone Number", type: "tel", isDummy: true },
    ],
    customFieldName: "",
    customFieldType: "text",
    selectedImages: [],
    selectedPartnerImage: null,
    selectedAdminImage: null,
    selectedProfile: null,
    scannarId: [],
    optometristId: [],
    selectedEmailProfile: null,
    eventStartDate: "",
    eventEndDate: "",
  });

  const [images, setImages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [scannar, setScannar] = useState([]);
  const [optometrist, setOptometrist] = useState([]);
  const [emailProfile, setEmailProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmailProfile = async () => {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/emailconfig/${whatsappUserId}`
        );
        setEmailProfile(response.data);
      } catch (error) {
        console.error("Error fetching email profile:", error);
      }
    };

    fetchEmailProfile();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/storage/${whatsappUserId}`
        );
        const imageFiles = response.data.filter(item =>
          item.mimeType.startsWith("image/")
        );
        setImages(imageFiles);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchProfiles = async () => {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/profiles/client/${whatsappUserId}`
        );
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchImages();
    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchRolesForScanner = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/2`
        );
        setScannar(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles for scanner:", error);
      }
    };

    const fetchRolesForOptometrist = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/3`
        );
        setOptometrist(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles for optometrist:", error);
      }
    };

    fetchRolesForScanner();
    fetchRolesForOptometrist();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "sessionTimeMinutes") {
      // Remove leading zeros
      const cleanedValue = value.replace(/^0+/, "");
      setFormData(prevData => ({
        ...prevData,
        [name]: cleanedValue,
      }));
    } else if (name === "eventStartDate" || name === "eventEndDate") {
      // Convert date format from yyyy-mm-dd to dd-mm-yyyy
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setFormData(prevData => ({
        ...prevData,
        [name]: formattedDate,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: selectedOption,
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: selectedOptions.map(option => option.value),
    }));
  };

  const handleAddPerson = () => {
    if (formData.personName && formData.personEmail) {
      setFormData(prevData => ({
        ...prevData,
        whoWillBePresent: [
          ...prevData.whoWillBePresent,
          { name: prevData.personName, email: prevData.personEmail },
        ],
        personName: "",
        personEmail: "",
      }));
    }
  };

  const handleDeletePerson = index => {
    setFormData(prevData => ({
      ...prevData,
      whoWillBePresent: prevData.whoWillBePresent.filter((_, i) => i !== index),
    }));
  };

  const handleAddInstrument = () => {
    if (formData.instrument) {
      setFormData(prevData => ({
        ...prevData,
        instruments: [...prevData.instruments, prevData.instrument],
        instrument: "",
      }));
    }
  };

  const handleDeleteInstrument = index => {
    setFormData(prevData => ({
      ...prevData,
      instruments: prevData.instruments.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomField = () => {
    if (formData.customFieldName && formData.customFieldType) {
      setFormData(prevData => ({
        ...prevData,
        customFields: [
          ...prevData.customFields,
          {
            name: prevData.customFieldName,
            type: prevData.customFieldType,
            isDummy: false,
          },
        ],
        customFieldName: "",
        customFieldType: "text",
      }));
    }
  };

  const handleDeleteCustomField = index => {
    setFormData(prevData => ({
      ...prevData,
      customFields: prevData.customFields.filter(
        (_, i) => i !== index && !_.isDummy
      ),
    }));
  };

  const validateForm = () => {
    // Implement your validation logic here
    return true;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      paymentCollection: formData.paymentCollection,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      key: formData.clientRazorpayKey,
      secret: formData.clientRazorpaySecret,
      linkedAccountId: formData.linkedAccountId,
      numCounters: formData.numberOfCounters,
      maxParticipationPerCounter: formData.maxParticipationPerCounter,
      sessionTimePerCounterHours: formData.sessionTimeHours,
      sessionTimePerCounterMinutes: formData.sessionTimeMinutes,
      Whowillbepresent: formData.whoWillBePresent,
      Instrumenttobecarried: formData.instruments,
      customFields: formData.customFields.filter(field => !field.isDummy),
      images: formData.selectedImages.map(image => image.value),
      patnerlog: formData.selectedPartnerImage
        ? formData.selectedPartnerImage.value
        : null,
      eventownerlogo: formData.selectedAdminImage
        ? formData.selectedAdminImage.value
        : null,
      status: "approved",
      instance_id: formData.selectedProfile
        ? formData.selectedProfile.value
        : null,
      scanner: formData.scannarId,
      optimistic: formData.optometristId,
      emailConfig: formData.selectedEmailProfile
        ? formData.selectedEmailProfile.value
        : null,
      // eventStartDate: formData.eventStartDate,
      // eventEndDate: formData.eventEndDate,
    };

    console.log(payload);
    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/eventmodel/events/${id}`,
        payload
      );
      console.log("Response:", response.data);
      navigate("/EventApprove");
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div style={sectionStyle}>
              <h3>Select Images</h3>
              <Select
                isMulti
                options={images.map(image => ({
                  value: image.path,
                  label: image.filename,
                }))}
                onChange={selectedOptions =>
                  handleSelectChange("selectedImages", selectedOptions)
                }
                value={formData.selectedImages}
                styles={{ container: base => ({ ...base, ...inputStyle }) }}
              />
            </div>
            <div style={sectionStyle}>
              <h3>Select Image for Partner</h3>
              <Select
                options={images.map(image => ({
                  value: image.path,
                  label: image.filename,
                }))}
                onChange={selectedOption =>
                  handleSelectChange("selectedPartnerImage", selectedOption)
                }
                value={formData.selectedPartnerImage}
                styles={{ container: base => ({ ...base, ...inputStyle }) }}
              />
            </div>
            <div style={sectionStyle}>
              <h3>Select Image for Admin</h3>
              <Select
                options={images.map(image => ({
                  value: image.path,
                  label: image.filename,
                }))}
                onChange={selectedOption =>
                  handleSelectChange("selectedAdminImage", selectedOption)
                }
                value={formData.selectedAdminImage}
                styles={{ container: base => ({ ...base, ...inputStyle }) }}
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Number of Counters</label>
              <input
                type="number"
                style={inputStyle}
                name="numberOfCounters"
                value={formData.numberOfCounters}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Max Participation Per Counter</label>
              <input
                type="number"
                style={inputStyle}
                name="maxParticipationPerCounter"
                value={formData.maxParticipationPerCounter}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* <div style={sectionStyle}>
              <label style={labelStyle}>Event Start Date</label>
              <input
                type="date"
                style={inputStyle}
                name="eventStartDate"
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Event End Date</label>
              <input
                type="date"
                style={inputStyle}
                name="eventEndDate"
                onChange={handleInputChange}
                required
              />
            </div> */}
            <div style={sectionStyle}>
              <div style={flexContainer}>
                <div>
                  <label style={labelStyle}>
                    Session Time Per Counter (Hours)
                  </label>
                  <input
                    type="number"
                    style={halfWidthInput}
                    name="sessionTimeHours"
                    value={formData.sessionTimeHours}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Session Time Per Counter (Minutes)
                  </label>
                  <input
                    type="number"
                    style={halfWidthInput}
                    name="sessionTimeMinutes"
                    value={formData.sessionTimeMinutes}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div style={sectionStyle}>
              <h3>Select WhatsApp Profile</h3>
              <Select
                options={profiles.map(profile => ({
                  value: profile.instance_id,
                  label: profile.name,
                }))}
                onChange={selectedOption =>
                  handleSelectChange("selectedProfile", selectedOption)
                }
                value={formData.selectedProfile}
                styles={{ container: base => ({ ...base, ...inputStyle }) }}
              />
            </div>
            <div style={sectionStyle}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="emailProfile"
              >
                Select Email Profile
              </label>
              <Select
                id="emailProfile"
                name="emailProfile"
                options={
                  emailProfile
                    ? emailProfile.map(profile => ({
                        value: profile._id,
                        label: profile.user,
                      }))
                    : []
                }
                onChange={selectedOption =>
                  handleSelectChange("selectedEmailProfile", selectedOption)
                }
                value={formData.selectedEmailProfile}
                className="basic-single-select"
                classNamePrefix="select"
                styles={{
                  control: base => ({
                    ...base,
                    borderColor: "#B197FC",
                  }),
                }}
              />
            </div>
            <div style={sectionStyle}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="scannar"
              >
                Scannar
              </label>
              <Select
                id="scannar"
                name="scannar"
                isMulti
                options={scannar.map(option => ({
                  value: option._id,
                  label: option.Name,
                }))}
                onChange={selectedOptions =>
                  handleMultiSelectChange("scannarId", selectedOptions)
                }
                value={formData.scannarId
                  .map(id => scannar.find(s => s._id === id))
                  .filter(Boolean)
                  .map(s => ({ value: s._id, label: s.Name }))}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: base => ({
                    ...base,
                    borderColor: "#B197FC",
                  }),
                }}
              />
            </div>
            <div style={sectionStyle}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="optometrist"
              >
                Optometrist
              </label>
              <Select
                id="optometrist"
                name="optometrist"
                isMulti
                options={optometrist.map(option => ({
                  value: option._id,
                  label: option.Name,
                }))}
                onChange={selectedOptions =>
                  handleMultiSelectChange("optometristId", selectedOptions)
                }
                value={formData.optometristId
                  .map(id => optometrist.find(o => o._id === id))
                  .filter(Boolean)
                  .map(o => ({ value: o._id, label: o.Name }))}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: base => ({
                    ...base,
                    borderColor: "#B197FC",
                  }),
                }}
              />
            </div>
            <div style={sectionStyle}>
              <h3>Employee Present From The Company.</h3>
              <input
                type="text"
                placeholder="Name"
                style={inputStyle}
                name="personName"
                value={formData.personName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                placeholder="Email"
                style={inputStyle}
                name="personEmail"
                value={formData.personEmail}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                style={buttonStyle}
                onClick={handleAddPerson}
                disabled={!formData.personName || !formData.personEmail}
              >
                Add
              </button>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Name</th>
                    <th style={thTdStyle}>Email</th>
                    <th style={thTdStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.whoWillBePresent.map((p, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{p.name}</td>
                      <td style={thTdStyle}>{p.email}</td>
                      <td style={thTdStyle}>
                        <button
                          type="button"
                          style={iconButtonStyle}
                          onClick={() => handleDeletePerson(index)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={sectionStyle}>
              <h3>Instruments to be Carried</h3>
              <input
                type="text"
                placeholder="Instrument"
                style={inputStyle}
                name="instrument"
                value={formData.instrument}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                style={buttonStyle}
                onClick={handleAddInstrument}
                disabled={!formData.instrument}
              >
                Add
              </button>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Instrument</th>
                    <th style={thTdStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.instruments.map((inst, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{inst}</td>
                      <td style={thTdStyle}>
                        <button
                          type="button"
                          style={iconButtonStyle}
                          onClick={() => handleDeleteInstrument(index)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={sectionStyle}>
              <h3>Question to be asked to the user.</h3>
              <input
                type="text"
                placeholder="Field Name"
                style={inputStyle}
                name="customFieldName"
                value={formData.customFieldName}
                onChange={handleInputChange}
                required
              />
              <select
                style={inputStyle}
                name="customFieldType"
                value={formData.customFieldType}
                onChange={handleInputChange}
                required
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
              </select>
              <button
                type="button"
                style={buttonStyle}
                onClick={handleAddCustomField}
                disabled={
                  !formData.customFieldName || !formData.customFieldType
                }
              >
                Add
              </button>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Field Name</th>
                    <th style={thTdStyle}>Field Type</th>
                    <th style={thTdStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.customFields.map((field, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{field.name}</td>
                      <td style={thTdStyle}>{field.type}</td>
                      <td style={thTdStyle}>
                        {!field.isDummy && (
                          <button
                            type="button"
                            style={iconButtonStyle}
                            onClick={() => handleDeleteCustomField(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div>
              <div style={sectionStyle}>
                <label style={labelStyle}>Payment Collection</label>
                <select
                  style={inputStyle}
                  name="paymentCollection"
                  value={formData.paymentCollection}
                  onChange={handleInputChange}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {formData.paymentCollection === "yes" && (
                <>
                  <div style={sectionStyle}>
                    <label style={labelStyle}>Payment Method</label>
                    <select
                      style={inputStyle}
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="clientRazorpay">Client Razorpay</option>
                      <option value="ourRazorpay">Our Razorpay</option>
                    </select>
                  </div>
                  <div style={sectionStyle}>
                    <div>
                      <label style={labelStyle}>Amount</label>
                      <input
                        type="number"
                        style={inputStyle}
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {formData.paymentMethod === "clientRazorpay" && (
                      <>
                        <div>
                          <label style={labelStyle}>Key</label>
                          <input
                            type="text"
                            style={inputStyle}
                            name="clientRazorpayKey"
                            value={formData.clientRazorpayKey}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Secret</label>
                          <input
                            type="text"
                            style={inputStyle}
                            name="clientRazorpaySecret"
                            value={formData.clientRazorpaySecret}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </>
                    )}
                    {formData.paymentMethod === "ourRazorpay" && (
                      <div>
                        <label style={labelStyle}>Linked Account ID</label>
                        <input
                          type="text"
                          style={inputStyle}
                          name="linkedAccountId"
                          value={formData.linkedAccountId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
    outline: "none",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
    color: "#555",
  };

  const sectionStyle = {
    marginBottom: "20px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "10px 0",
    backgroundColor: "#B197FC",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    position: "relative",
  };

  const iconButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#B197FC",
    fontSize: "1.2em",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f1f1f1",
  };

  const flexContainer = {
    display: "flex",
    justifyContent: "space-between",
  };

  const halfWidthInput = {
    ...inputStyle,
    width: "48%",
  };

  const formContainerStyle = {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    textAlign: "center",
    fontSize: "2.5em",
    color: "#333",
    marginBottom: "20px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  };

  return (
    <div style={formContainerStyle}>
      <h1 style={headingStyle}>Edit Approve Page</h1>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div style={buttonContainerStyle}>
          {currentStep > 1 && (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button type="submit" style={buttonStyle} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditApprovePage;
