import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axiosSetup";
import { CheckCircle } from "lucide-react";

export default function UserFormFillGenerationTimeSlot() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("register") === "true") {
      setCurrentPage(2);
    }

    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/timeslotevent/${id}`
        );
        setEventData(response.data.event);
        console.log(response.data.event);

        const initialFormData = {
          Name: "",
          Email: "",
          "Phone Number": "",
        };

        response.data.event.customFields.forEach(field => {
          initialFormData[field.name] = "";
        });
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [id]);

  useEffect(() => {
    if (eventData && eventData.images && eventData.images.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % eventData.images.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [eventData]);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  }, []);

  const validateField = useCallback((name, value) => {
    let error = "";
    if (value.trim().length === 0) {
      error = `${name} is required`;
    } else {
      switch (name) {
        case "Email":
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = "Email is invalid";
          }
          break;
        case "Phone Number":
          if (!/^\d{10}$/.test(value)) {
            error = "Phone number must be 10 digits";
          }
          break;
        default:
          break;
      }
    }
    setFormErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const handleSlotSelection = useCallback((date, time) => {
    setFormData(prev => ({
      ...prev,
      selectedSlot: { date, time },
    }));
    setFormErrors(prev => ({
      ...prev,
      selectedSlot: "",
    }));
  }, []);

  const cleanForm = useCallback(() => {
    const cleanedFormData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setFormData(cleanedFormData);
    setFormErrors({});
  }, [formData]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    const fieldsToValidate = [
      "Name",
      "Email",
      "Phone Number",
      ...eventData.customFields.map(f => f.name),
    ];

    fieldsToValidate.forEach(field =>
      validateField(field, formData[field] || "")
    );

    const hasErrors = Object.values(formErrors).some(error => error !== "");
    if (hasErrors || !formData.selectedSlot) {
      setIsSubmitting(false);
      if (!formData.selectedSlot) {
        setFormErrors(prev => ({
          ...prev,
          selectedSlot: "Please select a time slot",
        }));
      }
      return;
    }

    const participantData = {
      ...formData,
      MobileNumber: formData["Phone Number"],
    };
    delete participantData["Phone Number"];

    const postData = {
      eventId: id,
      selectedTimeslot: formData.selectedSlot,
      participantData: participantData,
    };

    console.log(postData);

    try {
      const registrationResponse = await axios.post(
        "http://localhost:5001/api/v1/register",
        postData
      );
      const registrationId = registrationResponse.data?.registration?._id;

      if (eventData.paymentCollection === "no") {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          cleanForm();
          window.location.href = `${window.location.pathname}?register=true`;
        }, 3000);
      } else {
        const paymentMethod = eventData.paymentMethod;
        const key =
          paymentMethod === "Client Razorpay"
            ? eventData.key
            : import.meta.env.VITE_API_KEY;
        const amount = eventData.amount;

        const options = {
          key,
          amount: amount * 100,
          currency: "INR",
          name: "Event Registration",
          description: "Complete your registration",
          handler: async function (response) {
            setShowSuccessPopup(true);
            setTimeout(() => {
              setShowSuccessPopup(false);
              cleanForm();
              window.location.href = `${window.location.pathname}?register=true`;
            }, 3000);
          },
          prefill: {
            name: formData.Name,
            email: formData.Email,
            MobileNumber: formData["Phone Number"],
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: async function () {
              await axios.delete(
                `http://localhost:5001/api/v1/register/delete/${registrationId}`
              );
            },
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Error during registration or payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedSlots = useMemo(() => {
    if (!eventData) return {};
    return eventData.availableTimeslots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      if (!acc[slot.date].some(s => s.time === slot.time)) {
        acc[slot.date].push(slot);
      }
      return acc;
    }, {});
  }, [eventData]);

  const formatDate = useCallback(dateString => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }, []);

  const getInputType = useCallback(type => {
    const allowedTypes = ["text", "number", "password", "email", "tel"];
    return allowedTypes.includes(type) ? type : "text";
  }, []);

  const handlePhoneInput = useCallback(
    e => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [e.target.name]: value,
      }));
      validateField(e.target.name, value);
    },
    [validateField]
  );

  const toggleDateExpansion = useCallback(date => {
    setExpandedDate(prevDate => (prevDate === date ? null : date));
  }, []);

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        Loading...
      </div>
    );
  }

  const renderFirstPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
        {eventData.eventName}
      </h1>
      <div className="relative w-full h-0 pb-[56.25%] mb-4 sm:mb-6 md:mb-8 overflow-hidden rounded-lg shadow-2xl">
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {eventData.images.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={img}
                alt={`Event image ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {eventData.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
      <div className="bg-white bg-opacity-10 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">
          Event Description
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-4">
          {eventData.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-base sm:text-lg md:text-xl">
              Start Date: {eventData.eventDate}
              <span className="text-sm sm:text-base md:text-lg">
                {" "}
                | Start Time: {eventData.startTime}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                {" "}
                | End Time: {eventData.endTime}
              </span>
            </p>
            <p className="text-base sm:text-lg md:text-xl">
              End Date: {eventData.endDate}
            </p>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-lg sm:text-xl font-semibold shadow-lg"
        onClick={() =>
          (window.location.href = `${window.location.pathname}?register=true`)
        }
      >
        Register Now
      </motion.button>
    </div>
  );

  const renderSecondPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
        Event Registration
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white bg-opacity-10 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl"
      >
        {[
          { name: "Name", type: "text" },
          { name: "Email", type: "email" },
          { name: "Phone Number", type: "tel" },
          ...eventData.customFields,
        ].map(field => (
          <div className="mb-4 sm:mb-6" key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-base sm:text-lg mb-1 sm:mb-2"
            >
              {field.name}
            </label>
            <input
              type={getInputType(field.type)}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={
                field.name === "Phone Number"
                  ? handlePhoneInput
                  : handleInputChange
              }
              required
              className={`w-full bg-white bg-opacity-10 border border-gray-300 rounded-lg py-2 px-3 sm:px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formErrors[field.name] ? "border-red-500" : ""
              }`}
              pattern={field.name === "Phone Number" ? "[0-9]*" : undefined}
              inputMode={field.name === "Phone Number" ? "numeric" : undefined}
            />
            {formErrors[field.name] && (
              <p className="mt-1 text-red-500 text-sm">
                {formErrors[field.name]}
              </p>
            )}
          </div>
        ))}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Select a Time Slot
          </h3>
          {Object.keys(groupedSlots).map(date => (
            <div key={date} className="mb-2 sm:mb-4">
              <button
                type="button"
                onClick={() => {
                  toggleDateExpansion(date);
                  setFormErrors(prev => ({ ...prev, selectedSlot: "" }));
                }}
                className="flex justify-between items-center w-full text-base sm:text-lg font-semibold mb-1 sm:mb-2 bg-white bg-opacity-10 p-2 rounded-lg"
              >
                <span>{date}</span>
                {expandedDate === date ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <AnimatePresence>
                {expandedDate === date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 overflow-hidden"
                  >
                    {groupedSlots[date].map(slot => (
                      <motion.button
                        key={slot._id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-2 px-3 sm:px-4 rounded-lg text-center ${
                          formData.selectedSlot?.date === slot.date &&
                          formData.selectedSlot?.time === slot.time
                            ? "bg-purple-500 text-white"
                            : "bg-white bg-opacity-10 text-white"
                        }`}
                        onClick={() =>
                          handleSlotSelection(slot.date, slot.time)
                        }
                      >
                        {slot.time}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {formErrors.selectedSlot && (
            <p className="mt-1 text-red-500 text-sm">
              {formErrors.selectedSlot}
            </p>
          )}
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-lg sm:text-xl font-semibold shadow-lg ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileTap={isSubmitting ? {} : { scale: 0.95 }}
        >
          {isSubmitting ? "Processing..." : "Complete Registration"}
        </motion.button>
      </form>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-2 left-2 sm:top-5 sm:left-5 bg-white bg-opacity-50 p-2 rounded-full"
        onClick={() => setCurrentPage(1)}
      >
        <FaArrowLeft className="text-black w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-xl flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle className="text-green-500 w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                Success!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Your registration is complete.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return currentPage === 1 ? renderFirstPage() : renderSecondPage();
}
