import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "../../../axiosSetup";
import { ClipLoader } from "react-spinners";

function Report() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true); // Start loading

    const userId = localStorage.getItem("whatsappuserId");
    if (!userId) {
      alert("User ID not found in local storage");
      setLoading(false);
      return;
    }

    const formattedFromDate = fromDate.split("-").reverse().join("/");
    const formattedToDate = toDate.split("-").reverse().join("/");

    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/wa/downloadcsv/${userId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      );
      console.log("Response:", response.data);
      downloadCSV(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
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
            style={{ backgroundColor: "#a855f7", color: "white" }}
          >
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
}

export default Report;
