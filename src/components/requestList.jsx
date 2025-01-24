import { useEffect, useState } from "react";
import { db } from "./firebase"; // Adjust the path to your firebase.js file
import { collection, getDocs } from "firebase/firestore"; // Firebase v9 modular imports
import axios from "axios"; // Axios to handle HTTP requests

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch requests from Firestore (using Firestore v9 modular SDK)
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const requestsData = querySnapshot.docs.map((doc) => doc.data());
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Handle request click to show the request details and file URL
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  // Handle download button click to download the PDF
  const handleDownload = async () => {
    if (selectedRequest && selectedRequest.filePath) {
      try {
        const { filePath, name, email, note } = selectedRequest;
        const formattedDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const fileName = `${name}_${email}_${note}_${formattedDate}.pdf`;

        // Perform file download using Axios (directly from the filePath)
        const fileResponse = await axios.get(filePath, { responseType: "blob" });

        // Create a blob URL and trigger download
        const blob = fileResponse.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName; // Set the custom file name
        link.click(); // Simulate a click to trigger the download
      } catch (error) {
        console.error("Error downloading the PDF:", error);
        alert("An error occurred while trying to download the PDF. Please try again.");
      }
    } else {
      console.error("No file URL found for download");
      alert("The selected request does not have a valid file URL.");
    }
  };

  // Fetch requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1>Requests</h1>
      {/* List of requests in card format */}
      <div className="request-list">
        {requests.map((request, index) => (
          <div
            key={index}
            className="request-card"
            onClick={() => handleRequestClick(request)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <h4>{request.name}</h4>
            <p>{request.email}</p>
            <p>{request.note}</p>
          </div>
        ))}
      </div>

      {/* Show selected request's details */}
      {selectedRequest && (
        <div
          className="request-detail-modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "80%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <h3>{selectedRequest.name}</h3>
          <p><strong>Email:</strong> {selectedRequest.email}</p>
          <p><strong>Note:</strong> {selectedRequest.note}</p>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestList;
