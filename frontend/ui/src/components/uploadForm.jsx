import { useState } from "react";
import Button from "./button";

export default function UploadForm({ title, apiEndpoint, fields }) {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // ✅ success or failure flag
  const [loading, setLoading] = useState(false); // ✅ disable button while uploading

  const handleUpload = async (e) => {
    e.preventDefault();

    if (fields.includes("file") && !file)
      return alert("Please select a file before uploading!");
    if (fields.includes("semester") && !semester)
      return alert("Please select a semester!");
    if (fields.includes("branch") && !branch)
      return alert("Please select a branch!");

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (semester) formData.append("semester", semester);
    if (branch) formData.append("branch", branch);

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("authToken");

      const res = await fetch(`http://localhost:3000${apiEndpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Upload successful!");
        setIsSuccess(true);

        // ✅ Reset form fields after success
        setFile(null);
        setSemester("");
        setBranch("");
        e.target.reset();
      } else {
        setMessage(data.error || "Upload failed. Try again later.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error uploading. Try again later.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white/70 backdrop-blur-glass shadow-smooth rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>

      <form onSubmit={handleUpload} className="space-y-5">
        {fields.includes("file") && (
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
        )}

        {fields.includes("semester") && (
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} Semester
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.includes("branch") && (
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
        )}

        <Button
          label={loading ? "Uploading..." : `Upload ${title}`}
          type="submit"
          disabled={loading}
        />
      </form>

      {/* ✅ Success/Error Alert */}
      {message && (
        <div
          className={`text-center text-sm mt-4 px-4 py-2 rounded-lg ${
            isSuccess
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
