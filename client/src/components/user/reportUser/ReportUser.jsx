import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axiosSetup";
import { FaCalendarAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function ReportUser() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    console.log("hi");
    event.preventDefault();

    if (!fromDate.trim() || !toDate.trim()) {
      toast.error("Both date fields are required.");
      return;
    }

    console.log("hi");

    setLoading(true);

    const userId = localStorage.getItem("whatsappuserId");
    if (!userId) {
      toast.error("User ID not found in local storage");
      setLoading(false);
      return;
    }

    console.log("hi");

    // Format the dates as required by the endpoint (DD/MM/YYYY)
    const formattedFromDate = new Date(fromDate).toLocaleDateString("en-GB");
    const formattedToDate = new Date(toDate).toLocaleDateString("en-GB");
    console.log(
      `http://localhost:5001/api/v1/wa/downloadcsv/${userId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
    );
    try {
      // Send GET request with query parameters

      const response = await axios.get(
        `http://localhost:5001/api/v1/wa/downloadcsv/${userId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      );
      downloadCSV(response.data);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.log("test");
      toast.error("Error while generating report");
    } finally {
      setLoading(false);
    }
  };

  function downloadCSV(csvData) {
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="h-8 w-8 mr-2 text-[#B197FC]" />
          <h1 className="text-4xl font-bold text-gray-800">Report</h1>
        </div>
        <hr className="mb-8 border-gray-300" />
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="#B197FC" loading={loading} size={50} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xl font-semibold text-gray-700 mb-2"
              >
                From
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                max={today} // Prevent future dates
                required
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xl font-semibold text-gray-700 mb-2"
              >
                To
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                max={today} // Prevent future dates
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className={`bg-[#B197FC] hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default ReportUser;
