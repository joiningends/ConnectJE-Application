import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";

const OptometristEyePowerPage = () => {
  const { id, eventId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [patientInfo, setPatientInfo] = useState({ name: "", phoneNumber: "" });
  const [formData, setFormData] = useState({
    "right-spherical": "",
    "right-cylindrical": "",
    "right-axis": "",
    "right-addition": "",
    "left-spherical": "",
    "left-cylindrical": "",
    "left-axis": "",
    "left-addition": "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  // Fetch patient data
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/register/getbyid/${id}`)
      .then(response => {
        const { participantFields } = response.data;
        const nameField = participantFields.find(
          field => field.fieldName === "Name"
        );
        const mobileField = participantFields.find(
          field => field.fieldName === "MobileNumber"
        );

        setPatientInfo({
          name: nameField?.fieldValue || "",
          phoneNumber: mobileField?.fieldValue || "",
        });
      })
      .catch(error => {
        console.error("Error fetching patient data:", error);
      });
  }, [id]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async event => {
    event.preventDefault();
    if (!validateForm()) return;

    const whatsappUserId = localStorage.getItem("whatsappuserId");

    // Helper function to format numbers to two decimal places, ensuring leading zero for ".xx" cases
    const formatToTwoDecimals = value => {
      if (typeof value === "number" || !isNaN(parseFloat(value))) {
        const number = parseFloat(value); // Parse to float
        const formatted = number.toFixed(2); // Format to two decimal places
        return formatted.startsWith(".") ? `0${formatted}` : formatted; // Add leading 0 if missing
      }
      return value; // Return as is if not a valid number
    };

    const payload = {
      userId: id,
      eventId,
      opId: whatsappUserId,
      prescription: {
        leftEye: {
          cylindrical: formatToTwoDecimals(formData["left-cylindrical"]),
          spherical: formatToTwoDecimals(formData["left-spherical"]),
          axis: parseInt(formData["left-axis"], 10),
          additional: formatToTwoDecimals(formData["left-addition"] || "N/A"),
        },
        rightEye: {
          cylindrical: formatToTwoDecimals(formData["right-cylindrical"]),
          spherical: formatToTwoDecimals(formData["right-spherical"]),
          axis: parseInt(formData["right-axis"], 10),
          additional: formatToTwoDecimals(formData["right-addition"] || "N/A"),
        },
      },
    };

    console.log(payload);
    try {
      await axios.post("http://localhost:5001/api/v1/prescription", payload);
      setMessage({ type: "success", text: "Prescription saved successfully!" });
      navigate("/Scanner");
    } catch (error) {
      console.error("Error saving prescription:", error);
      setMessage({ type: "error", text: "Failed to save prescription." });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-center text-2xl font-bold text-white bg-purple-500 p-4 rounded-lg mb-6">
        Eye Power Prescription
      </h2>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium">Patient Name:</label>
          <input
            type="text"
            value={patientInfo.name}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-medium">Phone Number:</label>
          <input
            type="text"
            value={patientInfo.phoneNumber}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div>
          <h3 className="text-xl font-semibold text-purple-600 mb-4">
            Right Eye
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {["spherical", "cylindrical", "axis", "addition"].map(field => (
              <div key={`right-${field}`} className="flex flex-col">
                <label className="text-sm font-medium capitalize">
                  {field}:
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${field}`}
                  value={formData[`right-${field}`]}
                  onChange={e =>
                    handleInputChange(`right-${field}`, e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                {errors[`right-${field}`] && (
                  <span className="text-red-500 text-sm">
                    {errors[`right-${field}`]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-purple-600 mb-4">
            Left Eye
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {["spherical", "cylindrical", "axis", "addition"].map(field => (
              <div key={`left-${field}`} className="flex flex-col">
                <label className="text-sm font-medium capitalize">
                  {field}:
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${field}`}
                  value={formData[`left-${field}`]}
                  onChange={e =>
                    handleInputChange(`left-${field}`, e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
                {errors[`left-${field}`] && (
                  <span className="text-red-500 text-sm">
                    {errors[`left-${field}`]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`text-sm font-medium ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white font-bold rounded-lg"
          >
            Save Prescription
          </button>
        </div>
      </form>
    </div>
  );
};

export default OptometristEyePowerPage;
