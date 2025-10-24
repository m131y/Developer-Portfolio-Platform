import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchProject = async () => {
      try {
        // const response = await fetch(`/api/projects/${id}`);
        // const data = await response.json();
        // setProject(data);

        // Mock data for now
        setProject({
          id: 1,
          title: "Developer Portfolio Platform",
          summary: "개발자를 위한 포트폴리오 공유 플랫폼",
          descriptionMd:
            "# 프로젝트 설명\n\n이 프로젝트는 개발자들이 자신의 포트폴리오를 공유하고 관리할 수 있는 플랫폼입니다.\n\n## 주요 기능\n- 프로젝트 등록 및 관리\n- 기술 스택 태그\n- 좋아요 및 조회수\n- 댓글 기능",
          ownerId: 1,
          ownerNickname: "Developer",
          thumbnailUrl:
            "https://cdn.inflearn.com/public/courses/333461/cover/95a8ae57-6e38-45c0-a74c-01aa094822c5/333461.jpg",
          type: "웹 애플리케이션",
          status: "진행중",
          visibility: "public",
          techStacks: [
            { id: 1, name: "React", level: 5 },
            { id: 2, name: "Spring Boot", level: 4 },
            { id: 3, name: "PostgreSQL", level: 3 },
          ],
          media: [
            {
              id: 1,
              type: "image",
              url: "https://parkgang.github.io/assets/images/thumbnail-2bc257b12e64783dec57e6e1aa750093.png",
              sortOrder: 1,
            },
            {
              id: 2,
              type: "image",
              url: "https://raw.githubusercontent.com/eclipse-platform/eclipse.platform/master/platform/org.eclipse.platform/splash.png",
              sortOrder: 2,
            },
          ],
          likeCount: 42,
          viewCount: 1234,
          likedByMe: false,
          repoUrl: "https://github.com/example/repo",
          demoUrl: "https://example.com",
          docUrl: "https://docs.example.com",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-02-20T15:45:00Z",
        });
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = () => {
    // TODO: Implement like functionality
    setProject((prev) => ({
      ...prev,
      likedByMe: !prev.likedByMe,
      likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1,
    }));
  };

  if (loading) {
    return (
      <Layout>
        <Header />
        <main className="w-full flex-grow flex flex-col items-center justify-center py-10">
          <div className="text-xl text-gray-600">Loading...</div>
        </main>
        <Footer />
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <Header />
        <main className="w-full flex-grow flex flex-col items-center justify-center py-10">
          <div className="text-xl text-gray-600">Project not found</div>
        </main>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10 px-4">
        <div className="w-full max-w-5xl">
          {/* Thumbnail Section */}
          {project.thumbnailUrl && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {project.ownerNickname}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {project.viewCount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    project.visibility === "public"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.visibility === "public" ? "Public" : "Private"}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {project.status}
                </span>
              </div>
            </div>

            {/* Summary */}
            {project.summary && (
              <p className="text-xl text-gray-600 mb-6">{project.summary}</p>
            )}

            {/* Tech Stack */}
            {project.techStacks && project.techStacks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  기술 스택
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStacks.map((tech) => (
                    <span
                      key={tech.id}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      {tech.name}
                      {tech.level && (
                        <span className="text-xs text-gray-500">
                          {"★".repeat(tech.level)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Repository
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live Demo
                </a>
              )}
              {project.docUrl && (
                <a
                  href={project.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Documentation
                </a>
              )}
            </div>
          </div>

          {/* Description Section */}
          {project.descriptionMd && (
            <div className="mb-8 p-6 bg-white border-2 border-gray-200 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                상세 설명
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {/* TODO: Add markdown renderer */}
                {project.descriptionMd}
              </div>
            </div>
          )}

          {/* Media Gallery */}
          {project.media && project.media.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">미디어</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.media.map((media) => (
                  <div
                    key={media.id}
                    className="rounded-xl overflow-hidden shadow-md"
                  >
                    {media.type === "image" && (
                      <img
                        src={media.url}
                        alt={`Media ${media.sortOrder}`}
                        className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Actions */}
          <div className="mb-8 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    project.likedByMe
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      project.likedByMe ? "fill-current" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {project.likeCount}
                </button>
              </div>
              <div className="text-sm text-gray-500">
                등록: {new Date(project.createdAt).toLocaleDateString()} | 수정:{" "}
                {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Project Type & Status Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                프로젝트 유형
              </h3>
              <p className="text-gray-900">{project.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                진행 상태
              </h3>
              <p className="text-gray-900">{project.status}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default ProjectDetails;
