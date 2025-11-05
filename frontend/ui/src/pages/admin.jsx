import { useState } from "react";
import Button from "../components/button";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !semester || !branch) {
      return alert("Please fill all fields before uploading!");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("semester", semester);
    formData.append("branch", branch);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:3000/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Syllabus uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading syllabus. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center pt-24 px-4">
      {/* Page Title */}
      <h1 className="text-4xl font-semibold mb-8 tracking-tight">
        Admin Dashboard
      </h1>

      {/* Section: Syllabus Upload */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-glass shadow-smooth rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Syllabus Upload
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* File Input */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-xl p-2 text-sm focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Semester Dropdown */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-black"
            >
              <option value="">Select Semester</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
              <option value="4th">4th Semester</option>
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
              <option value="7th">7th Semester</option>
              <option value="8th">8th Semester</option>
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-black"
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>

          {/* Upload Button */}
          <Button label="Upload Syllabus" type="submit" />
        </form>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
