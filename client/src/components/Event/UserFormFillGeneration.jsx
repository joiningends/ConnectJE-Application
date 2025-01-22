import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axiosSetup";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCalendar,
  FaMapMarkerAlt,
  FaBuilding,
  FaGlobe,
  FaCreditCard,
  FaComment,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronLeft,
} from "react-icons/fa";

export default function UserFormFillGeneration() {
  const { id } = useParams();
  // const [eventData, setEventData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [showMaxRegistrationsReached, setShowMaxRegistrationsReached] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconMapping = {
    text: FaUser,
    email: FaEnvelope,
    tel: FaPhone,
    password: FaLock,
    date: FaCalendar,
    address: FaMapMarkerAlt,
    company: FaBuilding,
    website: FaGlobe,
    creditCard: FaCreditCard,
    comments: FaComment,
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/${id}`
        );
        setEventData(response.data);
        const initialFormData = { name: "", email: "", phone: "" };
        response.data.customFields.forEach(field => {
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
    const timer = setInterval(() => {
      setCurrentSlide(
        prevSlide => (prevSlide + 1) % (eventData?.images?.length || 1)
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [eventData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      error = value.trim() === "" ? "Name is required" : "";
    } else if (name === "email") {
      error = !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email format" : "";
    } else if (name === "phone") {
      error = !/^\d{10}$/.test(value) ? "Invalid phone number" : "";
    } else {
      const field = eventData?.customFields?.find(field => field.name === name);
      if (field && field.type === "text" && value.trim() === "") {
        error = `${field.name} is required`;
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;

    const formErrors = Object.values(errors).filter(error => error !== "");
    if (formErrors.length === 0) {
      setIsSubmitting(true);
      const updatedFormData = {
        Name: formData.name,
        Email: formData.email,
        MobileNumber: formData.phone,
        ...Object.fromEntries(
          Object.entries(formData).filter(
            ([key]) => !["name", "email", "phone"].includes(key)
          )
        ),
      };

      const postData = {
        eventId: id,
        participantData: updatedFormData,
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/api/v1/register",
          postData
        );

        if (
          response.data &&
          response.data.message ===
            "Maximum registrations reached for the event"
        ) {
          setShowMaxRegistrationsReached(true);
          setTimeout(() => setShowMaxRegistrationsReached(false), 5000);
          setIsSubmitting(false);
          return;
        }

        const registrationId = response.data?.registration?._id;

        if (eventData.paymentCollection === "no") {
          setShowThankYou(true);
          setTimeout(() => setShowThankYou(false), 5000);
          resetForm();
          setIsSubmitting(false);
        } else {
          // Initialize Razorpay payment
          const options = {
            key:
              eventData.paymentMethod === "Client Razorpay"
                ? eventData.key
                : import.meta.env.VITE_API_KEY,
            amount: eventData.amount * 100,
            currency: "INR",
            name: eventData.eventName,
            description: "Event Registration",
            handler: function (response) {
              setShowThankYou(true);
              setTimeout(() => setShowThankYou(false), 5000);
              resetForm();
              setIsSubmitting(false);
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: async function () {
                await axios.delete(
                  `http://localhost:5001/api/v1/register/delete/${registrationId}`
                );
                setIsSubmitting(false);
              },
            },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        }
      } catch (error) {
        console.error("Error submitting registration:", error);
        setIsSubmitting(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message ===
            "Maximum registrations reached for the event"
        ) {
          setShowMaxRegistrationsReached(true);
          setTimeout(() => setShowMaxRegistrationsReached(false), 5000);
        }
      }
    }
  };

  const resetForm = () => {
    const initialFormData = { name: "", email: "", phone: "" };
    eventData?.customFields?.forEach(field => {
      initialFormData[field.name] = "";
    });
    setFormData(initialFormData);
    setErrors({});
  };

  const renderPage1 = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-8 animate-pulse">
        {eventData?.eventName || "Loading..."}
      </h1>
      <div className="relative w-full h-screen mb-8 overflow-hidden rounded-lg shadow-xl">
        {eventData?.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Event image ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {eventData?.images?.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 mb-8 shadow-xl">
        <p className="text-lg mb-4">{eventData?.description || "Loading..."}</p>
        <p className="text-lg font-semibold">
          Event Timing: {eventData?.eventDate} - {eventData?.endDate}
        </p>
        <p className="text-lg font-semibold">
          Start Time: {eventData?.startTime} - End Time: {eventData?.endTime}
        </p>
      </div>
      <button
        onClick={() => setCurrentPage(2)}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
      >
        Register Now
      </button>
    </div>
  );

  const renderPage2 = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 flex items-center justify-center">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Event Registration
        </h2>
        <button
          onClick={() => setCurrentPage(1)}
          className="absolute top-4 left-4 bg-transparent text-white hover:text-pink-500 transition-colors duration-300"
        >
          <FaChevronLeft className="text-2xl" />
          <span className="sr-only">Back to Event Details</span>
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-purple-300" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full bg-transparent border-b-2 border-purple-300 py-2 pl-10 pr-4 focus:outline-none focus:border-pink-500 transition-all"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-purple-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full bg-transparent border-b-2 border-purple-300 py-2 pl-10 pr-4 focus:outline-none focus:border-pink-500 transition-all"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-purple-300" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full bg-transparent border-b-2 border-purple-300 py-2 pl-10 pr-4 focus:outline-none focus:border-pink-500 transition-all"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {eventData?.customFields?.map((field, index) => {
            const Icon = iconMapping[field.icon] || FaUser;
            return (
              <div key={index} className="relative">
                <Icon className="absolute top-3 left-3 text-purple-300" />
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  placeholder={field.label || field.name}
                  className="w-full bg-transparent border-b-2 border-purple-300 py-2 pl-10 pr-4 focus:outline-none focus:border-pink-500 transition-all"
                />
                {errors[field.name] && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm text-center">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Thank you!
            </h2>
            <p className="text-gray-600">Your registration was successful!</p>
          </div>
        </div>
      )}

      {showMaxRegistrationsReached && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm text-center">
            <FaExclamationCircle className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Registration Closed
            </h2>
            <p className="text-gray-600">
              Maximum registrations reached for this event. Thank you for your
              interest!
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return currentPage === 1 ? renderPage1() : renderPage2();
}
