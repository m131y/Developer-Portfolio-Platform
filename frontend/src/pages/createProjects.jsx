import { useState } from "react";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";

const CreateProjects = () => {
  const [formData, setFormData] = useState({
    title: "",
    isPublic: true,
    description: "",
    license: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Add API call to create repository
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10 px-4">
        <div className="w-full max-w-3xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Create a new repository
            </h1>
            <h3 className="text-xl text-gray-600">프로젝트를 관리해보세요</h3>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3">
              {/* Title Input */}
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목"
                required
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 bg-white text-gray-900 placeholder-gray-400 transition-colors"
              />
              {/* Public/Private Toggle */}
              <div className="bg-gray-200 rounded-full p-1 flex gap-1 min-w-[200px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPublic: true }))
                  }
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    formData.isPublic
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPublic: false }))
                  }
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    !formData.isPublic
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="설명"
                rows="20"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 bg-white text-gray-900 placeholder-gray-400 resize-vertical transition-colors resize-none"
              />
            </div>

            {/* License Select */}
            <div className="flex justify-end border-2 border-gray-300 p-2 rounded-xl">
              <select
                id="license"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 bg-white text-gray-900 appearance-none cursor-pointer transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">Add a license</option>
                <option value="none">None</option>
                <option value="mit">MIT License</option>
                <option value="apache-2.0">Apache License 2.0</option>
                <option value="gpl-3.0">GNU GPL v3</option>
                <option value="bsd-3-clause">BSD 3-Clause License</option>
                <option value="isc">ISC License</option>
                <option value="mpl-2.0">Mozilla Public License 2.0</option>
                <option value="lgpl-3.0">GNU LGPL v3</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="py-4 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Create Repository
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default CreateProjects;