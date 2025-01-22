import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";

function EditWhatsappGroup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [groupid, setGroupId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        console.log(`http://localhost:5001/api/v1/wgroup/whatsapp-group/${id}`);
        const response = await axios.get(
          `http://localhost:5001/api/v1/wgroup/whatsapp-group/${id}`
        );
        console.log(response);
        if (response.data.success) {
          const { name, groupid } = response.data.data;
          setName(name);
          setGroupId(groupid);
        } else {
          toast.error("Failed to fetch group details");
        }
      } catch (error) {
        toast.error("Failed to fetch group details");
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleSubmit = async event => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/wgroup/${id}`,
        {
          name,
          groupid,
        }
      );

      if (response.status === 200) {
        toast.success("WhatsApp group updated successfully!");
        setTimeout(() => {
          navigate("/WhatsappGroup");
        }, 1500);
      } else {
        toast.error("Failed to update WhatsApp group");
      }
    } catch (error) {
      toast.error("Failed to update WhatsApp group");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate("/WhatsappGroup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Edit WhatsApp Group
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="groupId"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Group ID
            </label>
            <input
              type="text"
              id="groupId"
              name="groupId"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Enter group ID"
              value={groupid}
              onChange={e => setGroupId(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className={`bg-[#B197FC] hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleBackClick}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Back
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default EditWhatsappGroup;
