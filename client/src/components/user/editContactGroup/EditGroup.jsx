import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import address from "../../../assets/address-book-regular.svg";
import axios from "../../../axiosSetup";

function EditGroup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/sections/${id}`
        );
        if (response.status === 200) {
          setGroupName(response.data.name);
        } else {
          toast.error("Failed to fetch group name");
        }
      } catch (error) {
        toast.error("Failed to fetch group name");
      }
    };

    fetchGroupName();
  }, [id]);

  const handleBackClick = () => {
    navigate("/contactGroup");
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!groupName.trim()) {
      toast.error("Group name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/sections/${id}`,
        {
          name: groupName,
        }
      );

      if (response.status === 200) {
        toast.success("Group updated successfully!");

        setTimeout(() => {
          navigate("/contactGroup");
        }, 1500);
      } else {
        toast.error("Failed to update group");
      }
    } catch (error) {
      toast.error("Failed to update group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <img src={address} alt="Address Book" className="h-8 w-8 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">Edit Group</h1>
        </div>
        <hr className="mb-8 border-gray-300" />
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="groupContactName"
              className="block text-xl font-semibold text-gray-700 mb-2"
            >
              Group Contact Name
            </label>
            <input
              type="text"
              id="groupContactName"
              name="groupContactName"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="Enter group contact name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
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
              {isSubmitting ? "Editing..." : "Edit"}
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

export default EditGroup;
