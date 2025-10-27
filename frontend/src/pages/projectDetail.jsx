import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import StorageService from "../services/storage"; // 사용자 정보를 가져오는 서비스 가정
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import Button from "../components/ui/Button"; // Button 컴포넌트 가정

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/api/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = () => {
    // 좋아요 로직
    setProject((prev) => ({
      ...prev,
      likedByMe: !prev.likedByMe,
      likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        await api.delete(`/api/projects/${id}`);
        alert("프로젝트가 성공적으로 삭제되었습니다.");
        navigate("/"); 
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("프로젝트 삭제에 실패했습니다.");
      }
    }
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

  // 🌟 소유자 확인 로직 강화
  const currentUser = StorageService.getUser(); // 로그인 사용자 정보
  const isOwner =
    (currentUser?.id &&
      project?.ownerId &&
      String(currentUser.id) === String(project.ownerId)) ||
    (currentUser?.email &&
      project?.ownerEmail &&
      currentUser.email === project.ownerEmail);

  const goEdit = () => navigate(`/projects/${id}/edit`);

return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10 px-4">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {project.title}
                  </h1>
                  {/* 🌟 소유자에게만 보이는 수정/삭제 버튼 그룹 */}
                  {isOwner && (
                    <div className="flex gap-2">
                      {/* Button 컴포넌트가 존재한다고 가정합니다. */}
                      <button
                        onClick={goEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                {/* 기존의 상세 정보 (작성자, 조회수 등) */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {/* ... (작성자 아이콘) ... */}
                    {project.ownerNickname || project.user?.nickname || "Owner"}
                  </span>
                  <span className="flex items-center gap-1">
                    {/* ... (조회수 아이콘) ... */}
                    {project.viewCount?.toLocaleString() || 0}
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
                      key={tech.id || tech.name}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
                    >
                      {tech.name}
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