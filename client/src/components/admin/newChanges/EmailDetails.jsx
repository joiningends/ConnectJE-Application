import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../axiosSetup";

function EmailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEmailData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/eventmodel/email/${id}`
        );
        if (response.status === 200) {
          setEmailData({
            subject: response.data.emailSubject || "",
            body: response.data.emailHtml || "",
          });
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailData();
  }, [id]);

  const handleQuillChange = (value, name) => {
    setEmailData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!emailData.subject) newErrors.subject = "Subject is required";
    if (!emailData.body) newErrors.body = "Body is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const payload = {
        emailSubject: emailData.subject,
        emailHtml: emailData.body,
      };
      console.log(JSON.stringify(payload));

      try {
        const response = await axios.put(
          `http://localhost:5001/api/v1/eventmodel/email/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            navigate("/Events");
          }, 1000);
        } else {
          console.error("Failed to save email");
        }
      } catch (error) {
        console.error("Error:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/Events");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="bg-[#B197FC] py-6 px-8">
            <h1 className="text-3xl font-bold text-white">
              Mail to be sent to the end user upon successful registration.
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={emailData.subject}
                onChange={value => handleQuillChange(value, "subject")}
                className="mt-1 h-40"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mt-20"
              >
                Body <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={emailData.body}
                onChange={value => handleQuillChange(value, "body")}
                className="mt-1 h-60"
              />
              {errors.body && (
                <p className="mt-1 text-sm text-red-600">{errors.body}</p>
              )}
            </div>
            <div className="flex justify-end pt-6 space-x-4">
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-red-500 text-white text-lg font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-[#B197FC] text-white text-lg font-semibold rounded-md shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md"
          >
            Email configuration saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EmailDetails;
