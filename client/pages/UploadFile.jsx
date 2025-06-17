import React, { useState } from "react";
import axios from "axios";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleSubjectChange = (e) => setSubject(e.target.value);

    const handleUpload = async () => {
        if (!file || !subject) {
            alert("Please select a file and subject.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subject);

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData);
            alert(response.data.message);
        } catch (error) {
            alert("Upload failed: " + error.response?.data?.error);
        }
    };

    return (
        <div>
            <h2>Upload Questions</h2>
            <input type="file" onChange={handleFileChange} />
            <select onChange={handleSubjectChange}>
                <option value="">Select Subject</option>
                <option value="programming">Programming</option>
                <option value="data-structures">Data Structures</option>
                <option value="dbms">DBMS</option>
                <option value="networking">Networking</option>
                <option value="operating-systems">Operating Systems</option>
            </select>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadFile;
