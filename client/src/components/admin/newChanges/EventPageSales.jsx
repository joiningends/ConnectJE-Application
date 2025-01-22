import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "../../../axiosSetup";

export default function EventPageSales() {
  const [eventName, setEventName] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [partnershipId, setPartnershipId] = useState("");
  const [roles, setRoles] = useState([]);
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [clientId, setClientId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientIdAndRoles = async () => {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      if (!whatsappuserId) return;

      try {
        const clientIdResponse = await axios.get(
          `http://localhost:5001/api/v1/role/getbyid/${whatsappuserId}`
        );
        const clientId = clientIdResponse.data.role.clientId;
        setClientId(clientId);

        const rolesResponse = await axios.get(
          `http://localhost:5001/api/v1/role/get/roles/${clientId}/4`
        );
        setRoles(rolesResponse.data.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClientIdAndRoles();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const whatsappuserId = localStorage.getItem("whatsappuserId");

    const commonFields = {
      eventType: "2",
      eventName: eventName,
      eventDate: startDate ? format(startDate, "dd-MM-yyyy") : "",
      endDate: endDate ? format(endDate, "dd-MM-yyyy") : "",
      startTime: startTime,
      endTime: endTime,
      description: description,
      Associationwith: partnershipId || null,
      PlaceofEvent: eventPlace || null,
      status: "pending",
      by: whatsappuserId,
      ContactPersonName: contactPersonName,
      ContactPersonPhoneNumber: contactPersonPhone,
    };
    console.log(commonFields);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/v1/eventmodel/${clientId}`,
        commonFields,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event created successfully:", response.data);
      navigate("/Event");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handlePhoneChange = e => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    setContactPersonPhone(numericValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Create Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Name
                </label>
                <input
                  id="eventName"
                  type="text"
                  required
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                />
              </div>

              <div>
                <label
                  htmlFor="eventPlace"
                  className="block text-sm font-medium text-gray-700"
                >
                  Place of Event
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-[#B197FC]" />
                  </div>
                  <input
                    id="eventPlace"
                    type="text"
                    required
                    value={eventPlace}
                    onChange={e => setEventPlace(e.target.value)}
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-[#B197FC]" />
                    </div>
                    <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      dateFormat="dd-MM-yyyy"
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                      placeholderText="DD-MM-YYYY"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-[#B197FC]" />
                    </div>
                    <DatePicker
                      selected={endDate}
                      onChange={date => setEndDate(date)}
                      dateFormat="dd-MM-yyyy"
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                      placeholderText="DD-MM-YYYY"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="h-5 w-5 text-[#B197FC]" />
                    </div>
                    <input
                      id="startTime"
                      type="time"
                      required
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="h-5 w-5 text-[#B197FC]" />
                    </div>
                    <input
                      id="endTime"
                      type="time"
                      required
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                />
              </div>

              <div>
                <label
                  htmlFor="partnership"
                  className="block text-sm font-medium text-gray-700"
                >
                  In Partnership with
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserFriends className="h-5 w-5 text-[#B197FC]" />
                  </div>
                  <select
                    id="partnership"
                    value={partnershipId}
                    onChange={e => setPartnershipId(e.target.value)}
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                  >
                    <option value="">Select Partner</option>
                    {roles.map(option => (
                      <option key={option._id} value={option._id}>
                        {option.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contactPersonName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Person Name
                </label>
                <input
                  id="contactPersonName"
                  type="text"
                  required
                  value={contactPersonName}
                  onChange={e => setContactPersonName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                />
              </div>

              <div>
                <label
                  htmlFor="contactPersonPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Person Phone Number
                </label>
                <input
                  id="contactPersonPhone"
                  type="tel"
                  required
                  value={contactPersonPhone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:border-[#B197FC]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#B197FC] hover:bg-[#9f7ff7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC]"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
