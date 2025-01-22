import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../axiosSetup";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";

function InstanceUserPage() {
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    instance_id: "",
    sectionId: "",
    message: "",
    minIntervalMs: "",
  });

  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/sections/users/${userId}`)
      .then(response => {
        setSections(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch sections:", error);
      });
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name !== "minIntervalMs" && value.length > 0) {
      setWarning(`Warning: You entered ${value} in the ${name} field.`);
    } else {
      setWarning("");
    }

    if (name === "minIntervalMs") {
      setWarning("");
    }
  };

  const handleMinIntervalKeyPress = e => {
    if (e.key === "Enter") {
      if (formData.minIntervalMs < 30000) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  };

  const handleSuccess = () => {
    setOpen(true);
    setWarning("");
  };

  const handleFailure = () => {
    setOpen(true);
    setWarning("Unable to process your request. Please try again later.");
  };

  const handleSectionChange = e => {
    setFormData({
      ...formData,
      sectionId: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);

    if (!validateNumber(formData.minIntervalMs)) {
      setWarning("Min Interval (ms) should be a numeric value.");
    } else if (formData.minIntervalMs < 30000) {
      handleFailure();
    } else {
      const data = {
        instance_id: formData.instance_id,
        sectionId: formData.sectionId,
        message: formData.message,
        minIntervalMs: formData.minIntervalMs,
      };

      axios
        .post("http://localhost:5001/api/v1/wa/media", data)
        .then(() => {
          console.log("Request Success");
          setFormData({
            instance_id: "",
            sectionId: "",
            message: "",
            minIntervalMs: "",
          });
          handleSuccess();
        })
        .catch(error => {
          console.log("Request Error:", error);
          handleFailure();
        });
    }
  };

  const validateNumber = value => {
    return /^[0-9]*$/.test(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200">
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-700 flex items-center">
            <span className=" pb-2 mr-2">Send Only Message</span>
            <BsArrowRight className="text-purple-700" />
          </h1>
          <hr className="mb-8" />
          <form>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Instance ID
              </label>
              <input
                type="text"
                name="instance_id"
                value={formData.instance_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Min Interval (ms)
              </label>
              <input
                type="text"
                name="minIntervalMs"
                value={formData.minIntervalMs}
                onChange={handleChange}
                onKeyPress={handleMinIntervalKeyPress}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Section
              </label>
              <select
                name="sectionId"
                value={formData.sectionId}
                onChange={handleSectionChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">None</option>
                {sections.map(section => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center justify-center w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold transition duration-300 ease-in-out shadow-md"
            >
              <span>Submit</span>
              <BsArrowRight className="ml-2" />
            </button>
          </form>
        </div>
        {open && (
          <div className="fixed bottom-4 left-0 right-0 mx-auto p-4 bg-red-500 text-white text-center rounded-lg shadow-md max-w-lg flex items-center justify-between">
            <BiErrorCircle className="text-2xl" />
            <span className="text-lg flex-grow">{warning}</span>
            <AiOutlineCloseCircle
              className="text-2xl cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InstanceUserPage;
