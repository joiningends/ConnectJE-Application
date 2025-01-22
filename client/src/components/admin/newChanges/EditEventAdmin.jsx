import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { FaCalendarAlt, FaClock, FaUser, FaPlus } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "../../../axiosSetup";
import { format, parse, isValid } from "date-fns";

const EditEventAdmin = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

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
    paymentMethod: "",
    numCounters: "",
    maxParticipationPerCounter: "",
    sessionTimePerCounterHours: "",
    sessionTimePerCounterMinutes: "",
    amount: "",
    key: "",
    secret: "",
    Associationwith: "",
    ContactPersonName: "",
    ContactPersonPhoneNumber: "",
    PlaceofEvent: "",
    status: "",
    by: "",
    instance_id: "",
    partner: "",
    scanner: [],
    optometrist: [],
    imageForPartner: "",
    imageForAdmin: "",
    whatsAppProfile: "",
    emailProfile: "",
  });
  const [customFields, setCustomFields] = useState([]);
  const [whoWillBePresent, setWhoWillBePresent] = useState([]);
  const [instrumentsToBeCarried, setInstrumentsToBeCarried] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [partnershipId, setPartnershipId] = useState("");
  const [scannarId, setScannarId] = useState([]);
  const [optometristId, setOptometristId] = useState([]);
  const [selectedPartnerImage, setSelectedPartnerImage] = useState(null);
  const [selectedAdminImage, setSelectedAdminImage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [linkedAccountId, setLinkedAccountId] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedEmailProfile, setSelectedEmailProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [scannar, setScannar] = useState([]);
  const [optometrist, setOptometrist] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [emailProfile, setEmailProfile] = useState(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEventData();
    fetchImages();
    fetchPartners();
    fetchWhatsappProfiles();
    fetchEmailProfiles();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/eventmodel/${eventId}`
      );
      const eventData = response.data;
      console.log(eventData);

      setEventType(
        eventData.eventType === "0"
          ? "Simple Event"
          : eventData.eventType === "1"
          ? "Time Slot Based Event"
          : "New Type"
      );

      const startDate = parse(eventData.eventDate, "dd-MM-yyyy", new Date());
      const endDate = parse(eventData.endDate, "dd-MM-yyyy", new Date());

      setFormData({
        ...eventData,
        startDate: isValid(startDate) ? startDate : null,
        endDate: isValid(endDate) ? endDate : null,
      });

      setCustomFields(eventData.customFields || []);
      setWhoWillBePresent(eventData.Whowillbepresent || []);
      setInstrumentsToBeCarried(eventData.Instrumenttobecarried || []);
      setSelectedImages(
        eventData.images && Array.isArray(eventData.images)
          ? eventData.images
              .map(image => ({
                value: image,
                label: image.split("/").pop(),
              }))
              .filter(img => img.value && img.label)
          : []
      );

      setPartnershipId(eventData.Associationwith || "");

      // Fetch scanners and optometrists first
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (whatsappuserId) {
        const [scannersResponse, optometristsResponse] = await Promise.all([
          axios.get(
            `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/2`
          ),
          axios.get(
            `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/3`
          ),
        ]);

        const scanners = scannersResponse.data.roles;
        const optometrists = optometristsResponse.data.roles;

        setScannar(scanners);
        setOptometrist(optometrists);

        // Now set the selected scanners with proper names
        if (eventData.scanner && eventData.scanner.length > 0) {
          setScannarId(
            eventData.scanner.map(scannerId => {
              const scanner = scanners.find(s => s._id === scannerId);
              return {
                value: scannerId,
                label: scanner ? scanner.Name : scannerId,
              };
            })
          );
        }

        // Set selected optometrists with proper names
        if (eventData.optimistic && eventData.optimistic.length > 0) {
          setOptometristId(
            eventData.optimistic.map(optometristId => {
              const optom = optometrists.find(o => o._id === optometristId);
              return {
                value: optometristId,
                label: optom ? optom.Name : optometristId,
              };
            })
          );
        }
      }

      const formatImage = image => ({
        value: image,
        label: image.split("/").pop(),
      });

      if (eventData.patnerlog) {
        const partnerImageName = eventData.patnerlog.split("/").pop();
        if (partnerImageName) {
          setSelectedPartnerImage({
            value: eventData.patnerlog,
            label: partnerImageName,
          });
        }
      }

      if (eventData.eventownerlogo) {
        const adminImageName = eventData.eventownerlogo.split("/").pop();
        if (adminImageName) {
          setSelectedAdminImage({
            value: eventData.eventownerlogo,
            label: adminImageName,
          });
        }
      }
      setPaymentMethod(eventData.paymentMethod || "");
      setSelectedProfile(
        eventData.whatsAppProfile
          ? {
              value: eventData.whatsAppProfile,
              label: eventData.whatsAppProfile,
            }
          : null
      );
      setSelectedEmailProfile(
        eventData.emailProfile
          ? { value: eventData.emailProfile, label: eventData.emailProfile }
          : null
      );
      setLinkedAccountId(eventData.linkedAccountId || "");
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      const response = await axios.get(
        `http://localhost:5001/api/v1/storage/${whatsappuserId}`
      );
      const imageFormats = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
      ];
      const filteredImages = response.data.filter(item =>
        imageFormats.includes(item.mimeType)
      );
      setImages(filteredImages);
      console.log(filteredImages);
      console.log(filteredImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchPartners = async () => {
    const whatsappuserId = localStorage.getItem("whatsappuserId");
    if (!whatsappuserId) return;

    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/role/get/roles/${whatsappuserId}/4`
      );
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchWhatsappProfiles = async () => {
    const whatsappUserId = localStorage.getItem("whatsappuserId");
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/profiles/client/${whatsappUserId}`
      );
      setProfiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching WhatsApp profiles:", error);
    }
  };

  const fetchEmailProfiles = async () => {
    const whatsappUserId = localStorage.getItem("whatsappuserId");
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/emailconfig/${whatsappUserId}`
      );
      setEmailProfile(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching email profile:", error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleImageChange = selectedOptions => {
    setSelectedImages(selectedOptions);
  };

  const handleScannarChange = selectedOptions => {
    setScannarId(
      selectedOptions.map(option => ({
        value: option.value,
        label: option.label,
      }))
    );
  };

  const handleOptometristChange = selectedOptions => {
    setOptometristId(
      selectedOptions.map(option => ({
        value: option.value,
        label: option.label,
      }))
    );
  };

  const handleCustomFieldChange = (index, field, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", type: "text" }]);
  };

  const removeCustomField = index => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
  };

  const handleWhoWillBePresentChange = (index, field, value) => {
    const updatedPeople = [...whoWillBePresent];
    updatedPeople[index][field] = value;
    setWhoWillBePresent(updatedPeople);
  };

  const addPersonPresent = () => {
    setWhoWillBePresent([...whoWillBePresent, { name: "", email: "" }]);
  };

  const removePersonPresent = index => {
    const updatedPeople = whoWillBePresent.filter((_, i) => i !== index);
    setWhoWillBePresent(updatedPeople);
  };

  const handleInstrumentChange = (index, value) => {
    const updatedInstruments = [...instrumentsToBeCarried];
    updatedInstruments[index] = value;
    setInstrumentsToBeCarried(updatedInstruments);
  };

  const addInstrument = () => {
    setInstrumentsToBeCarried([...instrumentsToBeCarried, ""]);
  };

  const removeInstrument = index => {
    const updatedInstruments = instrumentsToBeCarried.filter(
      (_, i) => i !== index
    );
    setInstrumentsToBeCarried(updatedInstruments);
  };

  const handleProfileSelect = selectedOption => {
    setSelectedProfile(selectedOption);
  };

  const handleEmailProfileSelect = selectedOption => {
    setSelectedEmailProfile(selectedOption);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Event name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (formData.startTime >= formData.endTime)
      newErrors.endTime = "End time must be after start time";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.paymentCollection)
      newErrors.paymentCollection = "Payment collection option is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const eventData = {
          ...formData,
          eventType:
            eventType === "Simple Event"
              ? "0"
              : eventType === "Time Slot Based Event"
              ? "1"
              : "2",
          customFields,
          Whowillbepresent: whoWillBePresent,
          Instrumenttobecarried: instrumentsToBeCarried,
          images: selectedImages.map(img => img.value),
          partner: partnershipId,
          scanner: scannarId.map(scanner => scanner.value),
          optimistic: optometristId.map(optometrist => optometrist.value),
          imageForPartner: selectedPartnerImage
            ? selectedPartnerImage.value
            : "",
          imageForAdmin: selectedAdminImage ? selectedAdminImage.value : "",
          whatsAppProfile: selectedProfile ? selectedProfile.value : "",
          emailProfile: selectedEmailProfile ? selectedEmailProfile.value : "",
          eventDate: formData.startDate
            ? format(formData.startDate, "dd-MM-yyyy")
            : "",
          endDate: formData.endDate
            ? format(formData.endDate, "dd-MM-yyyy")
            : "",
          linkedAccountId: linkedAccountId,
        };

        const response = await axios.put(
          `http://localhost:5001/api/v1/eventmodel/events/${eventId}`,
          eventData
        );
        console.log("Event updated successfully:", response.data);
        alert("Event updated successfully!");
        navigate("/Events");
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "#B197FC" }}
      >
        Edit Event
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Type */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="eventType"
          >
            Event Type
          </label>
          <select
            id="eventType"
            name="eventType"
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            style={{ borderColor: "#B197FC" }}
            required
          >
            <option value="">Select Event Type</option>
            <option value="Simple Event">Simple Event</option>
            <option value="Time Slot Based Event">Time Slot Based Event</option>
            <option value="New Type">New Type</option>
          </select>
        </div>

        {/* Partnership */}
        {eventType === "New Type" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              In Partnership with
            </label>
            <select
              name="partner"
              value={partnershipId}
              onChange={e => setPartnershipId(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
            >
              <option value="">Select Partner</option>
              {roles.map(option => (
                <option key={option._id} value={option._id}>
                  {option.Name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Scanner
          </label>
          <Select
            isMulti
            name="scanner"
            options={scannar.map(option => ({
              value: option._id,
              label: option.Name,
            }))}
            value={scannarId}
            onChange={handleScannarChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Optometrist */}
        {eventType === "New Type" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Optometrist
            </label>
            <Select
              isMulti
              name="optometrist"
              options={optometrist.map(option => ({
                value: option._id,
                label: option.Name,
              }))}
              value={optometristId}
              onChange={handleOptometristChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        )}

        {/* Event Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="eventName"
          >
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            style={{ borderColor: "#B197FC" }}
            required
          />
        </div>

        {/* Place of Event */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="PlaceofEvent"
          >
            Place of Event
          </label>
          <input
            type="text"
            id="PlaceofEvent"
            name="PlaceofEvent"
            value={formData.PlaceofEvent}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            style={{ borderColor: "#B197FC" }}
            required
          />
        </div>

        {/* Event Date and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              Start Date
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={date => handleDateChange("startDate", date)}
              dateFormat="dd-MM-yyyy"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              End Date
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={date => handleDateChange("endDate", date)}
              dateFormat="dd-MM-yyyy"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
        </div>

        {/* Start Time and End Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startTime"
            >
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endTime"
            >
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
        </div>

        {/* Description */}
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
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            style={{ borderColor: "#B197FC" }}
            rows="4"
            required
          ></textarea>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Images
          </label>
          <Select
            isMulti
            name="images"
            value={selectedImages}
            onChange={handleImageChange}
            options={images.map(image => ({
              value: image.path,
              label: image.filename,
            }))}
            className="basic-multi-select"
            classNamePrefix="select"
            isClearable={true}
            styles={{
              control: base => ({
                ...base,
                borderColor: "#B197FC",
              }),
            }}
          />
        </div>

        {/* Image for Partner */}
        {eventType === "New Type" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image for Partner
            </label>
            <Select
              name="imageForPartner"
              value={selectedPartnerImage}
              onChange={option => setSelectedPartnerImage(option)}
              options={images.map(image => ({
                value: image.path,
                label: image.filename,
              }))}
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              styles={{
                control: base => ({
                  ...base,
                  borderColor: "#B197FC",
                }),
              }}
            />
          </div>
        )}

        {/* Image for Admin */}
        {eventType === "New Type" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image for Admin
            </label>
            <Select
              name="imageForAdmin"
              value={selectedAdminImage}
              onChange={option => setSelectedAdminImage(option)}
              options={images.map(image => ({
                value: image.path,
                label: image.filename,
              }))}
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              styles={{
                control: base => ({
                  ...base,
                  borderColor: "#B197FC",
                }),
              }}
            />
          </div>
        )}

        {/* Number of Counters */}
        {eventType !== "Simple Event" && (
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
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
        )}

        {/* Max Participation Per Counter */}
        {eventType !== "Simple Event" && (
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
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#B197FC" }}
              required
            />
          </div>
        )}

        {/* Session Time Per Counter */}
        {eventType !== "Simple Event" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
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
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{ borderColor: "#B197FC" }}
                required
              />
            </div>
            <div className="mb-4">
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
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{ borderColor: "#B197FC" }}
                required
              />
            </div>
          </div>
        )}

        {/* Employee Present From The Company */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Employee Present From The Company
          </label>
          {whoWillBePresent.map((person, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={person.name}
                onChange={e =>
                  handleWhoWillBePresentChange(index, "name", e.target.value)
                }
                placeholder="Name"
                className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                style={{ borderColor: "#B197FC" }}
              />
              <input
                type="email"
                value={person.email}
                onChange={e =>
                  handleWhoWillBePresentChange(index, "email", e.target.value)
                }
                placeholder="Email"
                className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                style={{ borderColor: "#B197FC" }}
              />
              <button
                type="button"
                onClick={() => removePersonPresent(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPersonPresent}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
            style={{ backgroundColor: "#B197FC" }}
          >
            Add
          </button>
        </div>

        {/* Instruments to be carried */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Instruments to be carried
          </label>
          {instrumentsToBeCarried.map((instrument, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={instrument}
                onChange={e => handleInstrumentChange(index, e.target.value)}
                placeholder="Instrument"
                className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                style={{ borderColor: "#B197FC" }}
              />
              <button
                type="button"
                onClick={() => removeInstrument(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstrument}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
            style={{ backgroundColor: "#B197FC" }}
          >
            Add
          </button>
        </div>

        {/* Custom Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Question to be asked to the user
          </label>
          {customFields.map((field, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={field.name}
                onChange={e =>
                  handleCustomFieldChange(index, "name", e.target.value)
                }
                placeholder="Field Name"
                className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                style={{ borderColor: "#B197FC" }}
              />
              <select
                value={field.type}
                onChange={e =>
                  handleCustomFieldChange(index, "type", e.target.value)
                }
                className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 mr-2"
                style={{ borderColor: "#B197FC" }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="tel">Phone Number</option>
              </select>
              <button
                type="button"
                onClick={() => removeCustomField(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCustomField}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
            style={{ backgroundColor: "#B197FC" }}
          >
            Add
          </button>
        </div>

        {/* Payment Collection */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="paymentCollection"
          >
            Payment Collection
          </label>
          <select
            id="paymentCollection"
            name="paymentCollection"
            value={formData.paymentCollection === "no" ? "No" : "Yes"}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-nonefocus:border-blue-500"
            style={{ borderColor: "#B197FC" }}
            required
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {formData.paymentCollection === "Yes" && (
          <>
            {/* Amount */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="amount"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{ borderColor: "#B197FC" }}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="paymentMethod"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                style={{ borderColor: "#B197FC" }}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Client Razorpay">Client Razorpay</option>
                <option value="Our Razorpay">Our Razorpay</option>
              </select>
            </div>

            {paymentMethod === "Client Razorpay" && (
              <>
                {/* Key */}
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
                    value={formData.key}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    style={{ borderColor: "#B197FC" }}
                    required
                  />
                </div>

                {/* Secret */}
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
                    value={formData.secret}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    style={{ borderColor: "#B197FC" }}
                    required
                  />
                </div>
              </>
            )}

            {paymentMethod === "Our Razorpay" && (
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
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                  style={{ borderColor: "#B197FC" }}
                  required
                />
              </div>
            )}
          </>
        )}

        {/* WhatsApp Profile */}
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="whatsAppProfile"
          >
            Select WhatsApp Profile
          </label>
          <Select
            id="whatsAppProfile"
            name="whatsAppProfile"
            options={profiles.map(profile => ({
              value: profile.instance_id,
              label: profile.name,
            }))}
            value={selectedProfile}
            onChange={handleProfileSelect}
            className="basic-single"
            classNamePrefix="select"
          />
        </div> */}

        {/* Email Profile */}
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            value={selectedEmailProfile}
            onChange={handleEmailProfileSelect}
            className="basic-single"
            classNamePrefix="select"
          />
        </div> */}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            style={{ backgroundColor: "#B197FC" }}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Event"}
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate("/Events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventAdmin;
