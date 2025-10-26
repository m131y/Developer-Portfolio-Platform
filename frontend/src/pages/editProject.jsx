import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await axios.get("http://localhost:8080/api/projects${id}");
        const data = response.data;
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setDescription(data.description || "");
        setEndDate(data.endDate || "");
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" && err.response.data) ||
          err.message ||
          "Failed to load project";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const dto = {
      title,
      summary: summary || null,
      descriptionMd: description || null,
      startDate: startDate || null,
      endDate: endDate || null,
    };
    try {
      const response = await axios.put("http://localhost:8080/api/projects${id}", dto);
      const updated = response.data;
      navigate(`/projects/${updated.id}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.reponse?.data === "string" && err.response.data) ||
        err.message ||
        "Falied to update project";
      if (err?.response?.status === 401) {
        setError("Please log in to edit this projedt.");
      } else {
        setError(msg);
      }
    }
  };
  if (loading) {
    return <div className="container mx-auto p-4">Loading . . .</div>;
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="black mb-1 font-semibold">Title</label>
              <imput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
                maxLength={140}
              />
            </div>
            <div>
              <label className="black mb-1 font-semibold">Summary</label>
              <imput
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border p-2 rounded"
                required
                maxLength={400}
              />
            </div>
            <div>
              <label className="black mb-1 font-semibold">
                Description (Markdown)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded h-32"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="black mb-1 font-semibold">Start Date</label>
                <imput
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="black mb-1 font-semibold">EndDate</label>
                <imput
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default EditProject;
