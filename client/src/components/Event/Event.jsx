import { useState, useEffect } from "react";
import Select from "react-select";
import { FaCalendarAlt, FaClock, FaUser, FaPlus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import axios from "../../axiosSetup";
import { BsCalendar } from "react-icons/bs";
const EventCreationAdmin = () => {
  const [eventType, setEventType] = useState("");
  const [formData, setFormData] = useState({
    eventName: "",
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
    description: "",
    paymentCollection: "",
    maxRegistrations: "",
    numCounters: "",
    maxParticipationPerCounter: "",
    sessionTimePerCounterHours: "",
    sessionTimePerCounterMinutes: "",
    placeofevent: "",
  });
  const [customFields, setCustomFields] = useState([
    { name: "Name", type: "text", fixed: true },
    { name: "Email", type: "email", fixed: true },
    { name: "Phone Number", type: "tel", fixed: true },
  ]);
  const [newFieldName, setNewFieldName] = useState("");
  console.log(newFieldName);
  const [newFieldType, setNewFieldType] = useState("text");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPartnerImage, setSelectedPartnerImage] = useState(null);
  const [selectedAdminImage, setSelectedAdminImage] = useState(null);
  const [amount, setAmount] = useState("");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [linkedAccountId, setLinkedAccountId] = useState("");
  const [whoWillBePresent, setWhoWillBePresent] = useState([]);

  const [newPerson, setNewPerson] = useState({ name: "", email: "" });
  const [instrumentsToBeCarried, setInstrumentsToBeCarried] = useState([]);
  const [newInstrument, setNewInstrument] = useState("");
  const [association, setAssociation] = useState("");
  const [roles, setRoles] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [partnershipId, setPartnershipId] = useState("");
  console.log(partnershipId);
  const [optometrist, setOptometrist] = useState([]);
  const [optometristId, setOptometristId] = useState([]);
  const [scannar, setScannar] = useState([]);
  const [scannarId, setScannarId] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [emailProfile, setEmailProfile] = useState(null);
  const [selectedEmailProfile, setSelectedEmailProfile] = useState(null);

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

  const handleEmailProfileSelect = selectedOption => {
    setSelectedEmailProfile(selectedOption);
    localStorage.setItem("selectedEmailProfileId", selectedOption.value);
  };

  // Function to format date to dd-mm-yyyy
  const formatDate = date => {
    return format(date, "dd-MM-yyyy");
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  // Assume scannar and optometrist data are fetched and set in state
  const handleProfileSelect = selectedOption => {
    setSelectedProfile(selectedOption);
  };

  const handleScannarChange = selectedOptions => {
    setScannarId(selectedOptions);
  };

  const handleOptometristChange = selectedOptions => {
    setOptometristId(selectedOptions);
  };

  useEffect(() => {
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

    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchRoleById = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) {
        console.error("WhatsApp user ID not found in localStorage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/getbyid/${whatsappuserId}`
        );
        const { clientId } = response.data.role;
        setClientId(clientId);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRoleById();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/4`
        );
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/2`
        );
        setScannar(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/3`
        );
        setOptometrist(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Function to add a new person
  const addPerson = () => {
    if (newPerson.name && newPerson.email) {
      setWhoWillBePresent([...whoWillBePresent, newPerson]);
      setNewPerson({ name: "", email: "" });
    }
  };

  const removePerson = index => {
    setWhoWillBePresent(whoWillBePresent.filter((_, i) => i !== index));
  };

  // Function to add a new instrument
  const addInstrument = () => {
    if (newInstrument) {
      setInstrumentsToBeCarried([...instrumentsToBeCarried, newInstrument]);
      setNewInstrument("");
    }
  };

  const removeInstrument = index => {
    setInstrumentsToBeCarried(
      instrumentsToBeCarried.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.endDate < formData.startDate)
      newErrors.endDate = "End date must be after start date";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (formData.endTime <= formData.startTime)
      newErrors.endTime = "End time must be after start time";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.paymentCollection)
      newErrors.paymentCollection = "Payment collection option is required";
    if (formData.maxRegistrations < 0)
      newErrors.maxRegistrations = "Max registrations cannot be negative";

    if (eventType === "Time Slot Based Event") {
      if (!formData.numCounters || formData.numCounters < 1)
        newErrors.numCounters = "Number of counters must be at least 1";
      if (
        !formData.maxParticipationPerCounter ||
        formData.maxParticipationPerCounter < 1
      )
        newErrors.maxParticipationPerCounter =
          "Max participation per counter must be at least 1";
      if (
        !formData.sessionTimePerCounterHours &&
        !formData.sessionTimePerCounterMinutes
      )
        newErrors.sessionTimePerCounter =
          "Session time per counter is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const deleteCustomField = index => {
    if (!customFields[index].fixed) {
      setCustomFields(customFields.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");

      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/storage/${whatsappuserId}`
        );

        // Define supported image formats
        const imageFormats = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/bmp",
          "image/tiff",
        ];

        // Filter images by MIME type
        const filteredImages = response.data.filter(item =>
          imageFormats.includes(item.mimeType)
        );

        setImages(filteredImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageChange = selectedOptions => {
    setSelectedImages(selectedOptions);
  };

  const handlePartnerImageChange = selectedOption => {
    setSelectedPartnerImage(selectedOption);
  };

  const handleAdminImageChange = selectedOption => {
    setSelectedAdminImage(selectedOption);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Hi");

    if (validateForm()) {
      setIsLoading(true);

      const newImages = selectedImages.map(image => image.value);
      const paymentCollectionValue =
        formData.paymentCollection === "Yes" ? "yes" : "no";
      const extractedOptometristIds = optometristId.map(item => item.value);
      const extractedScannarIds = scannarId.map(item => item.value);

      const commonFields = {
        eventType:
          eventType === "Simple Event"
            ? "0"
            : eventType === "New Type"
            ? "2"
            : "1",
        eventName: formData.eventName,
        eventDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description,
        paymentCollection: paymentCollectionValue,
        maxRegistrations: formData.maxRegistrations,
        paymentMethod,
        customFields: customFields.filter(field => !field.fixed), // Exclude fixed fields
        images: newImages,
        amount,
        linkedAccountId,
        key,
        secret,
        Instrumenttobecarried: instrumentsToBeCarried || null,
        Whowillbepresent: whoWillBePresent || null,
        Associationwith: partnershipId || null,
        scanner: extractedScannarIds,
        optimistic: extractedOptometristIds || null,
        PlaceofEvent: formData.placeofevent || null,
        instance_id: selectedProfile?.value || null,
        patnerlog: selectedPartnerImage?.value || null,
        eventownerlogo: selectedAdminImage?.value || null,
        emailConfig: selectedEmailProfile.value,
      };

      const timeSlotFields = {
        numCounters: formData.numCounters,
        maxParticipationPerCounter: formData.maxParticipationPerCounter,
        sessionTimePerCounterHours: formData.sessionTimePerCounterHours,
        sessionTimePerCounterMinutes: formData.sessionTimePerCounterMinutes,
      };

      const formDataToSubmit =
        eventType === "Simple Event"
          ? commonFields
          : { ...commonFields, ...timeSlotFields };

      const convertedFormData = {
        ...formDataToSubmit,
        numCounters:
          formDataToSubmit.numCounters !== ""
            ? Number(formDataToSubmit.numCounters)
            : formDataToSubmit.numCounters,
        maxParticipationPerCounter:
          formDataToSubmit.maxParticipationPerCounter !== ""
            ? Number(formDataToSubmit.maxParticipationPerCounter)
            : formDataToSubmit.maxParticipationPerCounter,
        sessionTimePerCounterHours:
          formDataToSubmit.sessionTimePerCounterHours !== ""
            ? Number(formDataToSubmit.sessionTimePerCounterHours)
            : formDataToSubmit.sessionTimePerCounterHours,
        sessionTimePerCounterMinutes:
          formDataToSubmit.sessionTimePerCounterMinutes !== ""
            ? Number(formDataToSubmit.sessionTimePerCounterMinutes)
            : formDataToSubmit.sessionTimePerCounterMinutes,
      };

      const whatsappuserId = localStorage.getItem("whatsappuserId");
      console.log(convertedFormData);
      console.log(`http://localhost:5001/api/v1/eventmodel/${whatsappuserId}`);
      try {
        const response = await axios.post(
          `http://localhost:5001/api/v1/eventmodel/${whatsappuserId}`,
          convertedFormData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);

        navigate("/Events"); // Navigate to /Events after successful submission
      } catch (error) {
        console.error("Error making POST request:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addCustomField = () => {
    if (newFieldName && newFieldType) {
      setCustomFields([
        ...customFields,
        { name: newFieldName, type: newFieldType },
      ]);
      setNewFieldName("");
      setNewFieldType("text");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "#B197FC" }}
      >
        Event Registration Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="eventType"
          >
            Event Type
          </label>
          <div className="relative">
            <select
              id="eventType"
              name="eventType"
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              style={{ borderColor: "#B197FC" }}
              required
            >
              <option value="">Select Event Type</option>
              <option value="Simple Event">Simple Event</option>
              <option value="Time Slot Based Event">
                Time Slot Based Event
              </option>
              <option value="New Type">New Type</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IoMdArrowDropdown className="fill-current h-4 w-4" />
            </div>
          </div>
        </div>

        {eventType === "New Type" && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="partnership"
            >
              In Partnership with
            </label>
            <select
              id="partnership"
              name="partnership"
              value={partnershipId}
              onChange={e => setPartnershipId(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              style={{ borderColor: "#B197FC" }}
            >
              <option value="">Select Partner</option>
              {roles.map(option => (
                <option key={option.id} value={option._id}>
                  {option.Name}
                </option>
              ))}
            </select>
          </div>
        )}

        {eventType && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="scannar"
            >
              Scanner
            </label>
            <Select
              id="scannar"
              name="scannar"
              isMulti
              options={scannar.map(option => ({
                value: option._id,
                label: option.Name,
              }))}
              value={scannarId}
              onChange={handleScannarChange}
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
        )}
        {eventType === "New Type" && (
          <div className="mb-4">
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
              value={optometristId}
              onChange={handleOptometristChange}
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
        )}

        {eventType && (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="eventName"
              >
                Event Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                    errors.eventName
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  style={{ borderColor: errors.eventName ? "red" : "#B197FC" }}
                  placeholder="Enter event name"
                  required
                />
              </div>
              {errors.eventName && (
                <p className="text-red-500 text-xs italic">
                  {errors.eventName}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="eventName"
              >
                Place Of Event
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="placeofevent"
                  name="placeofevent"
                  value={formData.placeofevent}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                    errors.placeofevent
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  style={{ borderColor: errors.eventName ? "red" : "#B197FC" }}
                  placeholder="Enter place of event"
                  required
                />
              </div>
              {errors.placeofevent && (
                <p className="text-red-500 text-xs italic">
                  {errors.placeofevent}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.startDate}
                    onChange={date => handleDateChange("startDate", date)}
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date()} // Prevents selection of past dates
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-10 ${
                      errors.startDate
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.startDate ? "red" : "#B197FC",
                      width: "100%",
                    }}
                    placeholderText="dd-mm-yyyy"
                    required
                  />

                  <BsCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-xs italic">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.endDate}
                    minDate={
                      formData.startDate ? formData.startDate : new Date()
                    }
                    onChange={date => handleDateChange("endDate", date)}
                    dateFormat="dd-MM-yyyy"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-10 ${
                      errors.endDate
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.endDate ? "red" : "#B197FC",
                      width: "100%",
                    }}
                    placeholderText="dd-mm-yyyy"
                    required
                  />
                  <BsCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-xs italic">
                    {errors.endDate}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startTime"
                >
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                      errors.startTime
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.startTime ? "red" : "#B197FC",
                    }}
                    required
                  />
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-xs italic">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endTime"
                >
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                      errors.endTime
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{ borderColor: errors.endTime ? "red" : "#B197FC" }}
                    required
                  />
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-xs italic">
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                  errors.description
                    ? "border-red-500"
                    : "focus:border-blue-500"
                }`}
                style={{ borderColor: errors.description ? "red" : "#B197FC" }}
                rows="4"
                placeholder="Enter event description"
                required
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs italic">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="images"
              >
                Select Images
              </label>
              <Select
                id="images"
                name="images"
                isMulti
                options={images.map(image => ({
                  value: image.path,
                  label: image.filename,
                }))}
                value={selectedImages}
                onChange={handleImageChange}
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
            {eventType === "New Type" && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="partnerImage"
                  >
                    Image for Partner
                  </label>
                  <Select
                    id="partnerImage"
                    name="partnerImage"
                    options={images.map(image => ({
                      value: image.path,
                      label: image.filename,
                    }))}
                    value={selectedPartnerImage}
                    onChange={handlePartnerImageChange}
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

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="adminImage"
                  >
                    Image for Admin
                  </label>
                  <Select
                    id="adminImage"
                    name="adminImage"
                    options={images.map(image => ({
                      value: image.path,
                      label: image.filename,
                    }))}
                    value={selectedAdminImage}
                    onChange={handleAdminImageChange}
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
              </>
            )}
            {eventType === "Simple Event" && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="maxRegistrations"
                >
                  Max Number of Registrations
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxRegistrations"
                    name="maxRegistrations"
                    value={formData.maxRegistrations}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                      errors.maxRegistrations
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.maxRegistrations ? "red" : "#B197FC",
                    }}
                    placeholder="Enter max registrations"
                    required
                  />
                  <FaUser className="absolute right-3 top-3 text-gray-400" />
                </div>
                {errors.maxRegistrations && (
                  <p className="text-red-500 text-xs italic">
                    {errors.maxRegistrations}
                  </p>
                )}
              </div>
            )}
            {eventType === "Simple Event" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Question to be asked to the user.
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFieldName}
                      onChange={e => setNewFieldName(e.target.value)}
                      placeholder="Field Name"
                      className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      style={{ borderColor: "#B197FC" }}
                    />
                    <select
                      value={newFieldType}
                      onChange={e => setNewFieldType(e.target.value)}
                      className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      style={{ borderColor: "#B197FC" }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="password">Password</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                    </select>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      style={{ backgroundColor: "#B197FC" }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                {customFields.length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Field Name
                          </th>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Field Type
                          </th>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customFields.map((field, index) => (
                          <tr key={index}>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {field.name}
                            </td>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {field.type}
                            </td>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {!field.fixed && (
                                <button
                                  type="button"
                                  onClick={() => deleteCustomField(index)}
                                  className="text-red-500 hover:text-red-700 font-bold py-1 px-3 rounded focus:outline-none"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {eventType !== "Simple Event" && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="numCounters"
                  >
                    Number of Counters
                  </label>
                  <input
                    type="number"
                    id="numCounters"
                    name="numCounters"
                    value={formData.numCounters}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                      errors.numCounters
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.numCounters ? "red" : "#B197FC",
                    }}
                    placeholder="Enter number of counters"
                    required
                  />
                  {errors.numCounters && (
                    <p className="text-red-500 text-xs italic">
                      {errors.numCounters}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="maxParticipationPerCounter"
                  >
                    Max Participation Per Counter
                  </label>
                  <input
                    type="number"
                    id="maxParticipationPerCounter"
                    name="maxParticipationPerCounter"
                    value={formData.maxParticipationPerCounter}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                      errors.maxParticipationPerCounter
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    style={{
                      borderColor: errors.maxParticipationPerCounter
                        ? "red"
                        : "#B197FC",
                    }}
                    placeholder="Enter max participation per counter"
                    required
                  />
                  {errors.maxParticipationPerCounter && (
                    <p className="text-red-500 text-xs italic">
                      {errors.maxParticipationPerCounter}
                    </p>
                  )}
                </div>

                <div className="mb-4 flex space-x-4">
                  <div className="flex-1">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="sessionTimePerCounterHours"
                    >
                      Session Time Per Counter (Hours)
                    </label>
                    <input
                      type="number"
                      id="sessionTimePerCounterHours"
                      name="sessionTimePerCounterHours"
                      value={formData.sessionTimePerCounterHours}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                        errors.sessionTimePerCounter
                          ? "border-red-500"
                          : "focus:border-blue-500"
                      }`}
                      style={{
                        borderColor: errors.sessionTimePerCounter
                          ? "red"
                          : "#B197FC",
                      }}
                      placeholder="Enter session time per counter in hours"
                      required
                    />
                    {errors.sessionTimePerCounter && (
                      <p className="text-red-500 text-xs italic">
                        {errors.sessionTimePerCounter}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="sessionTimePerCounterMinutes"
                    >
                      Session Time Per Counter (Minutes)
                    </label>
                    <input
                      type="number"
                      id="sessionTimePerCounterMinutes"
                      name="sessionTimePerCounterMinutes"
                      value={formData.sessionTimePerCounterMinutes}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                        errors.sessionTimePerCounter
                          ? "border-red-500"
                          : "focus:border-blue-500"
                      }`}
                      style={{
                        borderColor: errors.sessionTimePerCounter
                          ? "red"
                          : "#B197FC",
                      }}
                      placeholder="Enter session time per counter in minutes"
                      required
                    />
                    {errors.sessionTimePerCounter && (
                      <p className="text-red-500 text-xs italic">
                        {errors.sessionTimePerCounter}
                      </p>
                    )}
                  </div>
                </div>

                {eventType === "New Type" && (
                  <>
                    {/* Section for "Who will be present" */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Employee Present From The Company.
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newPerson.name}
                          onChange={e =>
                            setNewPerson({ ...newPerson, name: e.target.value })
                          }
                          className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                          style={{ borderColor: "#B197FC" }}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newPerson.email}
                          onChange={e =>
                            setNewPerson({
                              ...newPerson,
                              email: e.target.value,
                            })
                          }
                          className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                          style={{ borderColor: "#B197FC" }}
                        />
                        <button
                          type="button"
                          onClick={addPerson}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          style={{ backgroundColor: "#B197FC" }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Table for displaying people */}
                    {whoWillBePresent.length > 0 && (
                      <div className="mb-4 overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                          <thead>
                            <tr>
                              <th className="py-3 px-6 text-left border-b text-gray-600">
                                Name
                              </th>
                              <th className="py-3 px-6 text-left border-b text-gray-600">
                                Email
                              </th>
                              <th className="py-3 px-6 text-left border-b text-gray-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {whoWillBePresent.map((person, index) => (
                              <tr key={index}>
                                <td className="py-2 px-6 border-b text-gray-800">
                                  {person.name}
                                </td>
                                <td className="py-2 px-6 border-b text-gray-800">
                                  {person.email}
                                </td>
                                <td className="py-2 px-6 border-b text-gray-800">
                                  <button
                                    onClick={() => removePerson(index)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Section for "Instruments to be carried" */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Instruments to be carried
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Instrument"
                          value={newInstrument}
                          onChange={e => setNewInstrument(e.target.value)}
                          className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                          style={{ borderColor: "#B197FC" }}
                        />
                        <button
                          type="button"
                          onClick={addInstrument}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          style={{ backgroundColor: "#B197FC" }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Table for displaying instruments */}
                    {instrumentsToBeCarried.length > 0 && (
                      <div className="mb-4 overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                          <thead>
                            <tr>
                              <th className="py-3 px-6 text-left border-b text-gray-600">
                                Instrument
                              </th>
                              <th className="py-3 px-6 text-left border-b text-gray-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {instrumentsToBeCarried.map((instrument, index) => (
                              <tr key={index}>
                                <td className="py-2 px-6 border-b text-gray-800">
                                  {instrument}
                                </td>
                                <td className="py-2 px-6 border-b text-gray-800">
                                  <button
                                    onClick={() => removeInstrument(index)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Question to be asked to the user.
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFieldName}
                      onChange={e => setNewFieldName(e.target.value)}
                      placeholder="Field Name"
                      className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      style={{ borderColor: "#B197FC" }}
                    />
                    <select
                      value={newFieldType}
                      onChange={e => setNewFieldType(e.target.value)}
                      className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      style={{ borderColor: "#B197FC" }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="password">Password</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                    </select>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      style={{ backgroundColor: "#B197FC" }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {customFields.length > 0 && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Field Name
                          </th>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Field Type
                          </th>
                          <th className="py-3 px-6 text-left border-b text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customFields.map((field, index) => (
                          <tr key={index}>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {field.name}
                            </td>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {field.type}
                            </td>
                            <td className="py-2 px-6 border-b text-gray-800">
                              {!field.fixed && (
                                <button
                                  type="button"
                                  onClick={() => deleteCustomField(index)}
                                  className="text-red-500 hover:text-red-700 font-bold py-1 px-3 rounded focus:outline-none"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            {eventType && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="paymentCollection"
                  >
                    Payment Collection
                  </label>
                  <div className="relative">
                    <select
                      id="paymentCollection"
                      name="paymentCollection"
                      value={formData.paymentCollection}
                      onChange={handleInputChange}
                      className={`block appearance-none w-full bg-white border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white ${
                        errors.paymentCollection
                          ? "border-red-500"
                          : "focus:border-blue-500"
                      }`}
                      style={{
                        borderColor: errors.paymentCollection
                          ? "red"
                          : "#B197FC",
                      }}
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <IoMdArrowDropdown className="fill-current h-4 w-4" />
                    </div>
                  </div>
                  {errors.paymentCollection && (
                    <p className="text-red-500 text-xs italic">
                      {errors.paymentCollection}
                    </p>
                  )}

                  {formData.paymentCollection === "Yes" && (
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                        htmlFor="amount"
                      >
                        Amount
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        style={{ borderColor: "#B197FC" }}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                  )}

                  {formData.paymentCollection === "Yes" && (
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="paymentMethod"
                      >
                        Payment Method
                      </label>
                      <div className="relative">
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={e => setPaymentMethod(e.target.value)}
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
                          style={{ borderColor: "#B197FC" }}
                          required
                        >
                          <option value="">Select Payment Method</option>
                          <option value="Client Razorpay">
                            Client Razorpay
                          </option>
                          <option value="Our Razorpay">Our Razorpay</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <IoMdArrowDropdown className="fill-current h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod === "Client Razorpay" &&
                    formData.paymentCollection === "Yes" && (
                      <>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="key"
                          >
                            Key
                          </label>
                          <input
                            type="text"
                            id="key"
                            name="key"
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            style={{ borderColor: "#B197FC" }}
                            placeholder="Enter key"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="secret"
                          >
                            Secret
                          </label>
                          <input
                            type="text"
                            id="secret"
                            name="secret"
                            value={secret}
                            onChange={e => setSecret(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            style={{ borderColor: "#B197FC" }}
                            placeholder="Enter secret"
                            required
                          />
                        </div>
                      </>
                    )}

                  {paymentMethod === "Our Razorpay" &&
                    formData.paymentCollection === "Yes" && (
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="linkedAccountId"
                        >
                          Linked Account ID
                        </label>
                        <input
                          type="text"
                          id="linkedAccountId"
                          name="linkedAccountId"
                          value={linkedAccountId}
                          onChange={e => setLinkedAccountId(e.target.value)}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                          style={{ borderColor: "#B197FC" }}
                          placeholder="Enter linked account ID"
                          required
                        />
                      </div>
                    )}
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                      htmlFor="whatsappProfile"
                    >
                      Select WhatsApp Profile
                    </label>
                    <Select
                      id="whatsappProfile"
                      name="whatsappProfile"
                      options={profiles.map(profile => ({
                        value: profile.instance_id,
                        label: profile.name,
                      }))}
                      onChange={handleProfileSelect}
                      value={profiles.find(
                        profile => profile.instance_id === selectedProfile
                      )}
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
                </div>
                {eventType && (
                  <>
                    <div>
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
                        onChange={handleEmailProfileSelect}
                        value={selectedEmailProfile}
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
                  </>
                )}
              </>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{ backgroundColor: "#B197FC" }}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={() => (window.location.href = "/Events")}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EventCreationAdmin;
