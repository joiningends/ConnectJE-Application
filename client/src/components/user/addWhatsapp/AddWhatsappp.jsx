import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "../../../axiosSetup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddWhatsApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [instanceId, setInstanceId] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeValid, setQrCodeValid] = useState(false);
  const [userId, setUserId] = useState("");

  // Profile form state
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("91");
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem("whatsappuserId");
    setUserType(type);
  }, []);

  useEffect(() => {
    if (currentStep === 4) {
      generateQrCode();
    }
  }, [currentStep]);

  const generateInstanceId = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/wa/instanceid/64da53e6c44e5"
      );
      const data = response.data;

      setInstanceId(data.instance_id);
      toast.success("Instance ID generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate Instance ID.");
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/v1/wa/qr/${instanceId}/64da53e6c44e5`
      );
      const data = response.data;

      setQrCode(data.base64);
      setQrCodeValid(true);
      toast.success("QR Code generated successfully!");

      setTimeout(() => {
        setQrCodeValid(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate QR Code.");
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/profiles",
        {
          client: userType,
          name: name,
          mobile_no: mobileNo,
        }
      );

      setLoading(false);

      if (response.status === 201) {
        toast.success("Profile created successfully!");
        const data = response.data;
        console.log("Response:", data);
        setUserId(data._id);
        setCurrentStep(2);
      } else {
        console.error("Error:", response.statusText);
        toast.error("Failed to create profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes("duplicate")
      ) {
        toast.error(
          "This phone number is already registered. Please use a different number."
        );
      } else {
        toast.error("Failed to create profile.");
      }
    }
  };

  const copyInstanceId = () => {
    navigator.clipboard.writeText(instanceId);
    setCopied(true);
    toast.info("Instance ID copied to clipboard.");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleReload = () => {
    setInstanceId("");
    setCopied(false);
    generateInstanceId();
  };

  const handleFinish = () => {
    axios
      .put(`http://localhost:5001/api/v1/profiles/${userId}`, {
        instance_id: instanceId,
      })
      .then(response => {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile updated successfully!");
        navigate("/WAprofile");
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <ToastContainer />
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
        <div
          className={`h-4 rounded-full transition-width duration-300 ease-in-out ${
            currentStep === 1
              ? "w-1/4 bg-blue-600"
              : currentStep === 2
              ? "w-2/4 bg-blue-600"
              : currentStep === 3
              ? "w-3/4 bg-blue-600"
              : "w-full bg-blue-600"
          }`}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-12">
        <div className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ease-in-out ${
              currentStep >= 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            1
          </div>
          <div
            className={`mt-2 text-sm font-semibold transition-colors duration-300 ease-in-out ${
              currentStep >= 1 ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Step 1: Create Profile
          </div>
        </div>
        <div className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ease-in-out ${
              currentStep >= 2
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            2
          </div>
          <div
            className={`mt-2 text-sm font-semibold transition-colors duration-300 ease-in-out ${
              currentStep >= 2 ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Step 2: View PDF
          </div>
        </div>
        <div className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ease-in-out ${
              currentStep >= 3
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            3
          </div>
          <div
            className={`mt-2 text-sm font-semibold transition-colors duration-300 ease-in-out ${
              currentStep >= 3 ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Step 3: Generate Instance ID
          </div>
        </div>
        <div className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ease-in-out ${
              currentStep >= 4
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            4
          </div>
          <div
            className={`mt-2 text-sm font-semibold transition-colors duration-300 ease-in-out ${
              currentStep >= 4 ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Step 4: Generate Your QR Code
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div>
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Create Profile
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="mobileNo">
                Mobile Number
              </label>
              <PhoneInput
                country={"in"}
                value={mobileNo}
                onChange={phone => setMobileNo(phone)}
                inputClass="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <button
              onClick={createProfile}
              className="bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              View WhatsApp Solutions PDF
            </h2>
            <p className="mb-4 text-gray-600">
              Please view the PDF to understand the solutions we offer.
            </p>
            <button
              onClick={() => {
                window.open("/whatsappsolutions.pdf", "_blank");
                setCurrentStep(3);
                toast.info("PDF opened. Moving to the next step.");
              }}
              className="bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-300"
            >
              View PDF
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Generate Instance ID
            </h2>
            {instanceId ? (
              <div>
                <p className="mb-4 text-gray-600">
                  Your Instance ID has been generated. Please copy it for your
                  records.
                </p>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value={instanceId}
                    readOnly
                    className="border border-gray-300 p-2 rounded w-full mr-4"
                  />
                  <button
                    onClick={copyInstanceId}
                    className={`py-2 px-4 rounded shadow-md transition duration-300 ${
                      copied
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <button
                  onClick={handleReload}
                  className="bg-blue-600  text-white py-2 px-6 rounded shadow-md  hover:bg-blue-700 transition duration-300 ml-4"
                >
                  Regenerate Instance ID
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-6 rounded shadow-md  transition duration-300 ml-4"
                >
                  Next
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-600">
                  Click the button below to generate your Instance ID.
                </p>
                <button
                  onClick={generateInstanceId}
                  className="bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Instance ID"}
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Generate Your QR Code
            </h2>
            <div className="bg-purple-500 text-white p-2 rounded mb-4">
              Please make sure you click on Finish button
            </div>
            {qrCode ? (
              <div>
                <p className="mb-4 text-gray-600">
                  Scan the QR code below with your WhatsApp application.
                </p>
                <img src={`${qrCode}`} alt="QR Code" className="mb-4" />
                <button
                  onClick={generateQrCode}
                  className="bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-300"
                >
                  Regenerate QR Code
                </button>
                <button
                  onClick={handleFinish}
                  className="bg-green-600 text-white py-2 px-6 rounded shadow-md hover:bg-green-700 transition duration-300 ml-4"
                >
                  Finish
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-600">
                  Click the button below to generate your QR code.
                </p>
                <button
                  onClick={generateQrCode}
                  className="bg-blue-600 text-white py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
