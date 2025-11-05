import UploadForm from "../components/uploadForm";

export default function Admin() {
  return (
    <div className="min-h-screen bg-accent flex flex-col items-center pt-24 px-4 space-y-12">
      <h1 className="text-4xl font-semibold mb-4 tracking-tight">
        Admin Dashboard
      </h1>

      <UploadForm
        title="Syllabus"
        apiEndpoint="/api/admin/upload-syllabus"
        fields={["file", "semester", "branch"]}
      />

      <UploadForm
        title="Time Table"
        apiEndpoint="/api/admin/upload-timetable"
        fields={["file", "semester", "branch"]}
      />

      <UploadForm
        title="Faculty Details"
        apiEndpoint="/api/admin/upload-faculty"
        fields={["file"]}
      />
    </div>
  );
}
