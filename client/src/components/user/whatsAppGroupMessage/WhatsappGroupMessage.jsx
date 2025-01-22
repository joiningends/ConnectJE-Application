import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";

import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

function WhatsappGroupMessage() {
  const [userType, setUserType] = useState("");
  const [contactGroups, setContactGroups] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedGroupsMessage, setSelectedGroupsMessage] = useState([]); // For Send Message tab
  const [selectedGroupsAttachment, setSelectedGroupsAttachment] = useState([]); // For Send Attachment tab

  const [instanceIdMessage, setInstanceIdMessage] = useState("");
  const [instanceIdAttachment, setInstanceIdAttachment] = useState("");
  // const [groupInstanceIdMessage, setGroupInstanceIdMessage] = useState("");

  const [messageTextMessage, setMessageTextMessage] = useState("");
  const [messageTextAttachment, setMessageTextAttachment] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentsList, setAttachmentsList] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("sendMessage"); // Default active tab
  const [scheduleOption, setScheduleOption] = useState("startNow");
  const now = moment().tz("Asia/Kolkata");
  const [scheduleTime, setScheduleTime] = useState(now);
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem("whatsappuserId");
    setUserType(type);
  }, []);
  useEffect(() => {
    const now = new Date();

    const istTime = new Date(now.getTime());
    setScheduleTime(istTime);
  }, []);

  useEffect(() => {
    const fetchContactGroups = async () => {
      try {
        const response = await axios.get(
          `https://connectje.in/api/v1/wgroup/active/${userType}`
        );
        if (Array.isArray(response.data)) {
          setContactGroups(response.data);
          console.log(response.data);
        } else {
          console.error("Unexpected response format: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching contact groups:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `https://connectje.in/api/v1/profiles/client/${userType}`
        );
        if (Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          console.error("Unexpected response format: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const fetchAttachments = async () => {
      try {
        const response = await axios.get(
          `https://connectje.in/api/v1/storage/${userType}`
        );
        if (Array.isArray(response.data)) {
          setAttachmentsList(response.data);
        } else {
          console.error("Unexpected response format: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    if (userType) {
      fetchContactGroups();
      fetchProfiles();
      fetchAttachments();
    }
  }, [userType]);

  const handleProfileChange = (e, tab) => {
    const selectedProfileId = e.target.value;
    const profile = profiles.find(p => p._id === selectedProfileId);

    if (tab === "sendMessage") {
      setInstanceIdMessage(profile ? profile.instance_id : "");
    } else {
      setInstanceIdAttachment(profile ? profile.instance_id : "");
    }
  };

  // const handleGroupChange = (e, tab) => {
  //   const selectedGroupId = e.target.value;
  //   const group = contactGroups.find(g => g._id === selectedGroupId);

  //   if (tab === "sendMessage") {
  //     setSelectedGroupMessage(selectedGroupId);
  //     setGroupInstanceIdMessage(group ? group.instance_id : "");
  //   } else {
  //     setSelectedGroupAttachment(selectedGroupId);
  //     setGroupInstanceIdAttachment(group ? group.instance_id : "");
  //   }
  // };

  const handleSendMessageSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedTime = scheduleTime
      ? moment(scheduleTime).format("YYYY-MM-DD HH:mm")
      : null;

    let timeAns = scheduleOption === "schedule" ? formattedTime : "";

    try {
      const payload = {
        groups: selectedGroupsMessage.map(group => group.value),
        instance_id: instanceIdMessage,
        message: messageTextMessage,
        scheduleTime: timeAns,
      };

      console.log(payload);
      console.log(`https://connectje.in/api/v1/wa/group/${userType}`);
      axios.post(`https://connectje.in/api/v1/wa/group/${userType}`, payload);
      toast.success("Your request has been successfully submitted!");
      setTimeout(() => {
        navigate("/groupMessage");
      }, 1000);
    } catch (error) {
      console.error("Error preparing group message:", error);
      toast.error("Error preparing group message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAttachmentSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedAttachment = attachmentsList.find(a => a.path === attachment);

    if (!selectedAttachment) {
      toast.error("Attachment not found.");
      setIsSubmitting(false);
      return;
    }

    const formattedTime = scheduleTime
      ? moment(scheduleTime).format("YYYY-MM-DD HH:mm")
      : null;

    let timeAns = scheduleOption === "schedule" ? formattedTime : "";

    const payload = {
      groups: selectedGroupsAttachment.map(group => group.value),
      message: messageTextAttachment || "",
      media_url: selectedAttachment.path,
      instance_id: instanceIdAttachment,
      filename: selectedAttachment.filename,
      scheduleTime: timeAns,
    };
    console.log(payload);
    console.log(`https://connectje.in/api/v1/wa/groups/${userType}`);
    try {
      axios.post(`https://connectje.in/api/v1/wa/groups/${userType}`, payload);
      toast.success("Your request has been successfully submitted!");
      setTimeout(() => {
        navigate("/groupMessage");
      }, 1000);
    } catch (error) {
      console.error("Error sending group message with attachment:", error);
      toast.error("Error sending group message with attachment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = newTime => {
    setScheduleTime(newTime);
  };

  const groupOptions = contactGroups.map(group => ({
    value: group._id,
    label: group.name,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins flex items-center justify-center">
      <ToastContainer />
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Group Message
        </h1>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 mx-2 rounded-lg focus:outline-none ${
              activeTab === "sendMessage"
                ? "bg-purple-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("sendMessage")}
            style={{
              backgroundColor: activeTab === "sendMessage" ? "#B197FC" : "",
            }}
          >
            Send Message
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-lg focus:outline-none ${
              activeTab === "sendAttachment"
                ? "bg-purple-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab("sendAttachment")}
            style={{
              backgroundColor: activeTab === "sendAttachment" ? "#B197FC" : "",
            }}
          >
            Send Attachment
          </button>
        </div>
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Please check if your device is actively linked.
        </div>
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Make sure that the profile is a member in all the above selected
          group(s).
        </div>
        {activeTab === "sendMessage" && (
          <form onSubmit={handleSendMessageSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Profile <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  profiles.find(p => p.instance_id === instanceIdMessage)
                    ?._id || ""
                }
                onChange={e => handleProfileChange(e, "sendMessage")}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a profile</option>
                {profiles.map(profile => (
                  <option key={profile._id} value={profile._id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Profile Instance Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={instanceIdMessage}
                readOnly
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Group <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                options={groupOptions} // Assuming you're fetching options from API
                value={selectedGroupsMessage}
                onChange={selectedGroups =>
                  setSelectedGroupsMessage(selectedGroups)
                }
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="form-group">
              <label htmlFor="scheduleTime">Schedule Time:</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    value="startNow"
                    checked={scheduleOption === "startNow"}
                    onChange={() => setScheduleOption("startNow")}
                    style={{
                      marginRight: "8px",
                      accentColor: "#4b57ad", // Primary color for consistency
                      cursor: "pointer",
                      marginLeft: "5px", // Add left margin for radio button
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Start Now
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    value="schedule"
                    checked={scheduleOption === "schedule"}
                    onChange={() => setScheduleOption("schedule")}
                    style={{
                      marginRight: "8px",
                      accentColor: "#4b57ad", // Primary color for consistency
                      cursor: "pointer",
                      marginLeft: "5px", // Add left margin for radio button
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Schedule
                  </span>
                </label>
              </div>
              {scheduleOption === "schedule" && (
                <div style={{ marginTop: "10px" }}>
                  <DateTime
                    value={scheduleTime}
                    onChange={handleTimeChange}
                    dateFormat="DD/MM/YYYY" // Adjust the date format to your preference
                    timeFormat="hh:mm A" // 12-hour format with AM/PM
                    inputProps={{
                      style: {
                        border: "1px solid #4b57ad",
                        borderRadius: "4px",
                        padding: "5px",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: "38vw",
                        marginBottom: "1rem",
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Group Instance Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={groupInstanceIdMessage}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={messageTextMessage}
                onChange={e => setMessageTextMessage(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                rows="4"
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/groupMessage")}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-purple-400"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
        {activeTab === "sendAttachment" && (
          <form onSubmit={handleSendAttachmentSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Profile <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  profiles.find(p => p.instance_id === instanceIdAttachment)
                    ?._id || ""
                }
                onChange={e => handleProfileChange(e, "sendAttachment")}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a profile</option>
                {profiles.map(profile => (
                  <option key={profile._id} value={profile._id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Profile Instance Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={instanceIdAttachment}
                readOnly
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Group <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                options={groupOptions} // Assuming you're fetching options from API
                value={selectedGroupsAttachment}
                onChange={selectedGroups =>
                  setSelectedGroupsAttachment(selectedGroups)
                }
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="form-group">
              <label htmlFor="scheduleTime">Schedule Time:</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    value="startNow"
                    checked={scheduleOption === "startNow"}
                    onChange={() => setScheduleOption("startNow")}
                    style={{
                      marginRight: "8px",
                      accentColor: "#4b57ad", // Primary color for consistency
                      cursor: "pointer",
                      marginLeft: "5px", // Add left margin for radio button
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Start Now
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    value="schedule"
                    checked={scheduleOption === "schedule"}
                    onChange={() => setScheduleOption("schedule")}
                    style={{
                      marginRight: "8px",
                      accentColor: "#4b57ad", // Primary color for consistency
                      cursor: "pointer",
                      marginLeft: "5px", // Add left margin for radio button
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Schedule
                  </span>
                </label>
              </div>
              {scheduleOption === "schedule" && (
                <div style={{ marginTop: "10px" }}>
                  <DateTime
                    value={scheduleTime}
                    onChange={handleTimeChange}
                    dateFormat="DD/MM/YYYY" // Adjust the date format to your preference
                    timeFormat="hh:mm A" // 12-hour format with AM/PM
                    inputProps={{
                      style: {
                        border: "1px solid #4b57ad",
                        borderRadius: "4px",
                        padding: "5px",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: "38vw",
                        marginBottom: "1rem",
                      },
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Attachment <span className="text-red-500">*</span>
              </label>
              <select
                value={attachment || ""}
                onChange={e => setAttachment(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select an attachment</option>
                {attachmentsList.map(att => (
                  <option key={att.path} value={att.path}>
                    {att.filename}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message (Optional)
              </label>
              <textarea
                value={messageTextAttachment}
                onChange={e => setMessageTextAttachment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                rows="4"
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/groupMessage")}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-purple-400"
              >
                {isSubmitting ? "Sending..." : "Send Attachment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default WhatsappGroupMessage;
