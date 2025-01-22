import { useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "../../../axiosSetup";
import { ClipLoader } from "react-spinners";

function ReportAdmin() {
  const { id } = useParams();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true); // Start loading

    // Create the query string with fromDate and toDate
    const query = `fromDate=${fromDate}&toDate=${toDate}`;
    const url = `http://localhost:5001/api/v1/wa/downloadcsv/${id}?${query}`;

    try {
      // Use GET request to fetch the CSV data
      const response = await axios.get(url, {
        responseType: "blob", // Important to handle the file response
      });
      console.log("Response:", response);

      // Pass the blob data for download
      downloadCSV(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  function downloadCSV(csvData) {
    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: "text/csv" });
    // Create a link element
    const link = document.createElement("a");
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Set the href attribute of the link to the Blob URL
    link.href = url;
    // Set the download attribute with a file name
    link.download = "report.csv";
    // Append the link to the body
    document.body.appendChild(link);
    // Programmatically click the link to trigger the download
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);
  }

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontWeight: "bold" }}
      >
        Report
      </Typography>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ClipLoader color="#a855f7" loading={loading} size={50} />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="From"
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="To"
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{ backgroundColor: "#a855f7", color: "white" }} // bg-purple-400
          >
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
}

export default ReportAdmin;
