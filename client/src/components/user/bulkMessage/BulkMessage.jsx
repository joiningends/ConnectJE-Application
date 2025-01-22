import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosSetup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Spinner } from "./Spinner";

function BulkMessage() {
  const [userType, setUserType] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [contactGroups, setContactGroups] = useState([]);
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [activeTab, setActiveTab] = useState("sendMessage");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCallback, setPopupCallback] = useState(null);
  const navigate = useNavigate();
  const [scheduleOption, setScheduleOption] = useState("startNow");
  const now = moment().tz("Asia/Kolkata");

  const [scheduleTime, setScheduleTime] = useState(now);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [sendMessageData, setSendMessageData] = useState({
    selectedProfile: "",
    instanceId: "",
    selectedGroup: "",
    campaignName: "",
    message: "",
    minTimeInterval: "",
    maxTimeInterval: "",
    scheduleTime: getCurrentDateTime(),
  });

  const [sendAttachmentData, setSendAttachmentData] = useState({
    selectedProfile: "",
    instanceId: "",
    selectedGroup: "",
    campaignName: "",
    message: "",
    minTimeInterval: "",
    attachment: null,
    selectedFileName: "",
    maxTimeInterval: "",
    scheduleTime: getCurrentDateTime(),
  });

  useEffect(() => {
    const type = localStorage.getItem("whatsappuserId");
    setUserType(type);
  }, []);

  useEffect(() => {
    const fetchContactGroups = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/sections/active/${userType}`
        );
        setContactGroups(response.data);
      } catch (error) {
        console.error("Error fetching contact groups:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/profiles/client/${userType}`
        );
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchContactGroups();
    fetchProfiles();
  }, [userType]);

  const createCampaign = async scheduleTime => {
    const client = localStorage.getItem("whatsappuserId");
    const payload = {
      name:
        activeTab === "sendMessage"
          ? sendMessageData.campaignName
          : sendAttachmentData.campaignName,
      client: client,
      contractGroup:
        activeTab === "sendMessage"
          ? sendMessageData.selectedGroup
          : sendAttachmentData.selectedGroup,
      profile:
        activeTab === "sendMessage"
          ? sendMessageData.selectedProfile
          : sendAttachmentData.selectedProfile,
      ...(scheduleTime && { scheduleTime: scheduleTime }),
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/campain",
        payload
      );
      return response.data._id;
    } catch (error) {
      console.error("Error creating campaign:", error.response.data.error);
      toast.error(error.response.data.error);
      setLoading(false);
      throw error;
    }
  };

  const handleSendMessageSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formattedTime = scheduleTime
      ? moment(scheduleTime).format("YYYY-MM-DD HH:mm")
      : null;

    try {
      const campaignId = await createCampaign(formattedTime);
      let timeAns = scheduleOption === "schedule" ? formattedTime : new Date();

      const profile = profiles.find(
        p => p._id === sendMessageData.selectedProfile
      );
      const sender = `${profile.name}-${profile.mobile_no}`;

      const payload = {
        sectionId: sendMessageData.selectedGroup,
        sender: sender,
        campainid: campaignId,
        message: sendMessageData.message,
        instance_id: sendMessageData.instanceId,
        minIntervalMs: parseInt(sendMessageData.minTimeInterval, 10) * 1000,
        maxIntervalMs: parseInt(sendMessageData.maxTimeInterval, 10) * 1000,
        scheduleTime: timeAns,
      };
      payload.scheduleTime = moment(payload.scheduleTime).format(
        "YYYY-MM-DD HH:mm"
      );

      await axios.post("http://localhost:5001/api/v1/wa/send", payload);
      navigate("/bulkWhatsapp");
    } catch (error) {
      console.error("Error sending bulk message:", error);
      toast.error("Error sending bulk message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/storage/${userType}`
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

    fetchAttachments();
  }, [userType]);

  useEffect(() => {
    const now = new Date();
    const istTime = new Date(now.getTime());
    setScheduleTime(istTime);
  }, []);

  const handleSendAttachmentSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (
      !sendAttachmentData.selectedProfile ||
      !sendAttachmentData.selectedGroup ||
      !sendAttachmentData.campaignName ||
      !sendAttachmentData.minTimeInterval
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const selectedAttachment = attachmentsList.find(
      a => a.path === sendAttachmentData.attachment
    );

    if (!selectedAttachment) {
      toast.error("Attachment not found.");
      setLoading(false);
      return;
    }

    const formattedTime = scheduleTime
      ? moment(scheduleTime).format("YYYY-MM-DD HH:mm")
      : null;

    try {
      const campaignId = await createCampaign(formattedTime);
      let timeAns = scheduleOption === "schedule" ? formattedTime : new Date();

      const profile = profiles.find(
        p => p._id === sendAttachmentData.selectedProfile
      );
      const sender = `${profile.name}-${profile.mobile_no}`;

      const payload = {
        sectionId: sendAttachmentData.selectedGroup,
        sender: sender,
        campainid: campaignId,
        message: sendAttachmentData.message || "",
        media_url: selectedAttachment.path,
        filename: selectedAttachment.filename,
        instance_id: sendAttachmentData.instanceId,
        minIntervalMs: parseInt(sendAttachmentData.minTimeInterval, 10) * 1000,
        maxIntervalMs: parseInt(sendAttachmentData.maxTimeInterval, 10) * 1000,
        scheduleTime: timeAns,
      };

      payload.scheduleTime = moment(payload.scheduleTime).format(
        "YYYY-MM-DD HH:mm"
      );

      await axios.post("http://localhost:5001/api/v1/wa/send/media", payload);
      navigate("/bulkWhatsapp");
    } catch (error) {
      console.error("Error sending bulk message with attachment:", error);
      toast.error("Error sending bulk message with attachment");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e, tab) => {
    const selectedProfileId = e.target.value;
    const profile = profiles.find(p => p._id === selectedProfileId);

    if (tab === "sendMessage") {
      setSendMessageData({
        ...sendMessageData,
        selectedProfile: selectedProfileId,
        instanceId: profile ? profile.instance_id : "",
      });
    } else {
      setSendAttachmentData({
        ...sendAttachmentData,
        selectedProfile: selectedProfileId,
        instanceId: profile ? profile.instance_id : "",
      });
    }
  };

  const handleFormSubmitWithPopup = submitCallback => {
    setPopupCallback(() => submitCallback);
    setShowPopup(true);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);
    if (popupCallback) {
      popupCallback();
    }
  };

  const handleTimeChange = newTime => {
    setScheduleTime(newTime);
  };

  const handleDownloadExample = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:5001/params_in_message.pdf";
    link.download = "params_in.pdf";
    link.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins flex items-center justify-center">
      <ToastContainer />
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <p>
              JoiningEnds do not take any responsibility of the number getting
              blocked. Please click on continue or cancel.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePopupCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupConfirm}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Bulk Message
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
        {activeTab === "sendMessage" && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleFormSubmitWithPopup(() => handleSendMessageSubmit(e));
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Profile <span className="text-red-500">*</span>
              </label>
              <select
                value={sendMessageData.selectedProfile}
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
                Instance Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sendMessageData.instanceId}
                readOnly
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Group <span className="text-red-500">*</span>
              </label>
              <select
                value={sendMessageData.selectedGroup}
                onChange={e =>
                  setSendMessageData({
                    ...sendMessageData,
                    selectedGroup: e.target.value,
                  })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a group</option>
                {contactGroups.map(group => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sendMessageData.campaignName}
                onChange={e =>
                  setSendMessageData({
                    ...sendMessageData,
                    campaignName: e.target.value,
                  })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={sendMessageData.message}
                onChange={e =>
                  setSendMessageData({
                    ...sendMessageData,
                    message: e.target.value,
                  })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-between items-center mt-2">
                <span>Add custom variables: %param1%, %param2%,...</span>
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={handleDownloadExample}
                >
                  View Example
                </button>
              </div>
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
                      accentColor: "#4b57ad",
                      cursor: "pointer",
                      marginLeft: "5px",
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
                      accentColor: "#4b57ad",
                      cursor: "pointer",
                      marginLeft: "5px",
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
                    dateFormat="DD/MM/YYYY"
                    timeFormat="hh:mm A"
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
              <label className="block mb-2">Min Time Interval (sec)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={sendMessageData.minTimeInterval}
                onKeyPress={e => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const newValue =
                    sendMessageData.minTimeInterval * 10 + (charCode - 48);

                  if (charCode < 48 || charCode > 57 || newValue > 1000) {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const inputValue = e.target.value;
                  setSendMessageData({
                    ...sendMessageData,
                    minTimeInterval: inputValue,
                  });
                }}
                min="20"
                max="1000"
                required
              />
              <p className="text-red-500 mt-1">
                Please enter a value greater than 20 seconds.
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Max Time Interval (sec)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={sendMessageData.maxTimeInterval}
                onKeyPress={e => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const newValue =
                    sendMessageData.maxTimeInterval * 10 + (charCode - 48);

                  if (charCode < 48 || charCode > 57 || newValue > 1000) {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const inputValue = e.target.value;
                  setSendMessageData({
                    ...sendMessageData,
                    maxTimeInterval: inputValue,
                  });
                }}
                min="20"
                max="1000"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/bulkWhatsapp")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
        {activeTab === "sendAttachment" && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleFormSubmitWithPopup(() => handleSendAttachmentSubmit(e));
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Profile <span className="text-red-500">*</span>
              </label>
              <select
                value={sendAttachmentData.selectedProfile}
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
                Instance Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sendAttachmentData.instanceId}
                readOnly
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Group <span className="text-red-500">*</span>
              </label>
              <select
                value={sendAttachmentData.selectedGroup}
                onChange={e =>
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    selectedGroup: e.target.value,
                  })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a group</option>
                {contactGroups.map(group => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sendAttachmentData.campaignName}
                onChange={e =>
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    campaignName: e.target.value,
                  })
                }
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message
              </label>
              <textarea
                value={sendAttachmentData.message}
                onChange={e =>
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    message: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-between items-center mt-2">
                <span>Add custom variables: %param1%, %param2%,...</span>
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={handleDownloadExample}
                >
                  View Example
                </button>
              </div>
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
                      accentColor: "#4b57ad",
                      cursor: "pointer",
                      marginLeft: "5px",
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
                      accentColor: "#4b57ad",
                      cursor: "pointer",
                      marginLeft: "5px",
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
                    dateFormat="DD/MM/YYYY"
                    timeFormat="hh:mm A"
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
              <label className="block mb-2">Min Time Interval (sec)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={sendAttachmentData.minTimeInterval}
                onKeyPress={e => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const newValue =
                    sendAttachmentData.minTimeInterval * 10 + (charCode - 48);

                  if (charCode < 48 || charCode > 57 || newValue > 1000) {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const inputValue = e.target.value;
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    minTimeInterval: inputValue,
                  });
                }}
                min="20"
                max="1000"
                required
              />
              <p className="text-red-500 mt-1">
                Please enter a value greater than 20.
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Max Time Interval (sec)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={sendAttachmentData.maxTimeInterval}
                onKeyPress={e => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const newValue =
                    sendAttachmentData.maxTimeInterval * 10 + (charCode - 48);

                  if (charCode < 48 || charCode > 57 || newValue > 1000) {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  const inputValue = e.target.value;
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    maxTimeInterval: inputValue,
                  });
                }}
                min="20"
                max="1000"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Attachment</label>
              <Select
                options={attachmentsList.map(attachment => ({
                  value: attachment.path,
                  label: attachment.filename,
                }))}
                value={{
                  value: sendAttachmentData.attachment,
                  label: sendAttachmentData.selectedFileName,
                }}
                onChange={selectedOption =>
                  setSendAttachmentData({
                    ...sendAttachmentData,
                    attachment: selectedOption.value,
                    selectedFileName: selectedOption.label,
                  })
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                File Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sendAttachmentData.selectedFileName}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-gray-200"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/bulkWhatsapp")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BulkMessage;
