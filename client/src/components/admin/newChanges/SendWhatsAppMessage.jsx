import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "../../../axiosSetup"; // Assuming axios setup is correct
import { toast, ToastContainer } from "react-toastify"; // Importing react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const SendWhatsAppMessage = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (isValid) {
      setIsSending(true);
      try {
        // Retrieve the Facebook token from localStorage
        const facebookToken = localStorage.getItem("facebookToken");

        if (!facebookToken) {
          toast.error("Facebook token not available. Please log in.");
          return;
        }

        console.log(facebookToken);

        // Send POST request with the Facebook token in the Authorization header
        const response = await axios.post(
          "http://localhost:5001/api/v1/facebook/sendmessage",
          { toPhoneNumber: whatsappNumber },
          { headers: { Authorization: `Bearer ${facebookToken}` } }
        );

        // Handle success
        if (response.status === 200) {
          toast.success("Message sent successfully!");
          setWhatsappNumber(""); // Clear the form after success
        } else {
          toast.error("Failed to send message.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Error sending message.");
      } finally {
        setIsSending(false);
      }
    }
  };

  // Handle input change
  const handleInputChange = e => {
    const input = e.target.value.replace(/\D/g, "");
    setWhatsappNumber(input);
    setIsValid(input.length >= 10);
  };

  useEffect(() => {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(177, 151, 252, 0.3)";
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = 0;
        }
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans relative overflow-hidden">
      <canvas
        id="particleCanvas"
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="bg-white rounded-2xl p-10 shadow-lg w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <FaWhatsapp className="text-[#B197FC] text-6xl" />
        </div>
        <h1 className="text-[#B197FC] text-center mb-8 text-3xl font-bold">
          Send WhatsApp Message
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="whatsappNumber"
              className="block text-sm font-medium text-gray-700"
            >
              WhatsApp Number
            </label>
            <input
              id="whatsappNumber"
              type="tel"
              value={whatsappNumber}
              onChange={handleInputChange}
              placeholder="Enter WhatsApp number"
              className={`w-full p-4 text-base border-2 rounded-lg outline-none transition-all duration-300 ${
                isValid ? "border-[#B197FC]" : "border-red-500"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={!isValid || isSending}
            className={`w-full bg-[#B197FC] text-white border-none p-4 text-lg rounded-lg transition-all duration-300 font-bold uppercase tracking-wide ${
              isValid && !isSending
                ? "opacity-100 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default SendWhatsAppMessage;
