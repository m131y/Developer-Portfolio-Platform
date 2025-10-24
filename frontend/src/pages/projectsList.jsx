import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../services/auth";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth("/api/projects/search?keyword=");
        if (!res.ok) {
          throw new Error(`Failed to load projects: ${res.status}`);
        }
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
    load();
  }, []);

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
          <h2 classname="text-2xl font-bold mb-4">Projects</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.id} className="border-b py-2">
                <Link
                  to={`/projects/${p.id}`}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  {p.title}
                </Link>
                {p.summary && <p className="text-gray-600">{p.summary}</p>}
              </li>
            ))}
          </ul>
          <Link
            to="/projects/new"
            className="bg-blue-500 text-white px-4 py-2 mt-4 inline-block rounded hover:bg-blue-600"
          >
            Create Project
          </Link>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default ProjectsList;