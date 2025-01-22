import React, { useState } from "react";
import { FiMail, FiLock, FiServer, FiHash } from "react-icons/fi";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmailProfile = () => {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    secure: false,
    user: "",
    pass: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.host.trim()) {
      newErrors.host = "Host is required";
    }

    if (!formData.port) {
      newErrors.port = "Port is required";
    } else if (isNaN(formData.port)) {
      newErrors.port = "Port must be a number";
    }

    if (!formData.user.trim()) {
      newErrors.user = "User email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user)) {
      newErrors.user = "Invalid email format";
    }

    if (!formData.pass.trim()) {
      newErrors.pass = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      const whatsappuserId = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.post(
          `http://localhost:5001/api/v1/emailconfig/${whatsappuserId}`,
          formData
        );

        console.log("Form submitted:", response.data);
        navigate("/EmailProfiles");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      console.log(".");
    }
  };

  const handleCancel = () => {
    navigate("/EmailProfiles");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Profile Settings
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="host"
                className="block text-sm font-medium text-gray-700"
              >
                Host
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiServer className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="host"
                  id="host"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.host ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC] sm:text-sm`}
                  value={formData.host}
                  onChange={handleChange}
                  aria-invalid={errors.host ? "true" : "false"}
                />
                {errors.host && (
                  <p className="mt-2 text-sm text-red-600">{errors.host}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="port"
                className="block text-sm font-medium text-gray-700"
              >
                Port
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="port"
                  id="port"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.port ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC] sm:text-sm`}
                  value={formData.port}
                  onChange={handleChange}
                  aria-invalid={errors.port ? "true" : "false"}
                />
                {errors.port && (
                  <p className="mt-2 text-sm text-red-600">{errors.port}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="secure"
                name="secure"
                type="checkbox"
                checked={formData.secure}
                onChange={handleChange}
                className="h-4 w-4 text-[#B197FC] focus:ring-[#B197FC] border-gray-300 rounded"
              />
              <label
                htmlFor="secure"
                className="ml-2 block text-sm text-gray-900"
              >
                Secure Connection
              </label>
            </div>

            <div>
              <label
                htmlFor="user"
                className="block text-sm font-medium text-gray-700"
              >
                User Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="user"
                  id="user"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.user ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC] sm:text-sm`}
                  value={formData.user}
                  onChange={handleChange}
                  aria-invalid={errors.user ? "true" : "false"}
                />
                {errors.user && (
                  <p className="mt-2 text-sm text-red-600">{errors.user}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="pass"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="pass"
                  id="pass"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.pass ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-[#B197FC] focus:border-[#B197FC] sm:text-sm`}
                  value={formData.pass}
                  onChange={handleChange}
                  aria-invalid={errors.pass ? "true" : "false"}
                />
                {errors.pass && (
                  <p className="mt-2 text-sm text-red-600">{errors.pass}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#B197FC] hover:bg-[#9f85ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC] transition-colors duration-200"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailProfile;
