import  { useState } from "react";
import { db } from "./firebase"; // Adjust this to your Firebase config file path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Pinata API keys
const PINATA_API_KEY = "f0fe8eab69b59443c685";
const PINATA_SECRET_API_KEY = "e4283a5dc3ff8196e3eb3ef38aaae5ff1b22a5c09eaca6abf9a6675d1a5973ea";

function Request() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const uploadToPinata = async (file) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  
    const formData = new FormData();
    formData.append("file", file);
  
    // Updated headers: Add both the API Key and Secret API Key correctly
    const headers = {
      "pinata_api_key": PINATA_API_KEY,
      "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Pinata Upload Error: ", errorData);
        throw new Error(`Failed to upload file to Pinata: ${errorData.error}`);
      }
  
      const result = await response.json();
      const hash = result.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${hash}`;
    } catch (error) {
      console.error("Error uploading file to Pinata: ", error);
      throw error;
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("No file selected.");
      return;
    }

    setUploading(true);

    try {
      // Upload file to Pinata
      const fileURL = await uploadToPinata(file);

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, "requests"), {
        name,
        email,
        note,
        filePath: fileURL,
        timestamp: serverTimestamp(),
      });

      console.log("Data saved successfully to Firestore with ID:", docRef.id);

      // Reset form fields
      setName("");
      setEmail("");
      setNote("");
      setFile(null);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      alert("Error submitting the request. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <form
        className="h-50 w-50 rounded-4 shadow-lg p-4 border pb-5"
        style={{ maxWidth: "500px", minWidth: "300px", paddingBottom: "6vh" }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-center fs-4">Enter The Required Details</h1>

        {/* Name Field */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="name">Name</label>
        </div>

        {/* Email Field */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="Email">Email</label>
        </div>

        {/* Note Field */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="noteFile"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
          <label htmlFor="noteFile">Note</label>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center mb-5">
          <button
            className="btn fw-bold w-100"
            style={{ height: "45px", backgroundColor: "orange" }}
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Request;
