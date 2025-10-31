import { useNavigate } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import { useState } from "react";
import api from "../services/api";

// 날짜 형식을 "YYYY-MM-DD"로 변환하는 헬퍼 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (e) {
    console.error("Invalid date format:", dateString);
    return "";
  }
};

// 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환하는 헬퍼 함수
const getTodayDateString = () => {
  return formatDate(new Date());
};

const CreateProject = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 상태 설정: 시작 날짜는 오늘 날짜로 기본 설정
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(getTodayDateString()); // 🌟 오늘 날짜로 초기화
  const [endDate, setEndDate] = useState("");
  
  // 미디어 및 기술 스택은 빈 배열로 초기화
  const [media, setMedia] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  // 기타 생성 시 필요한 필드 (API 요구사항에 따라 추가)
  const [visibility, setVisibility] = useState("public");
  const [status, setStatus] = useState("진행중");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // 유효성 검사 (예시)
    if (!title || !startDate) {
        setError("제목과 시작 날짜는 필수입니다.");
        setIsSubmitting(false);
        return;
    }

    const dto = {
      title,
      summary: summary || null,
      descriptionMd: description || null,
      startDate: startDate || null, 
      endDate: endDate || null,
      media, 
      techStacks,
      visibility, // 기본값: public
      status,     // 기본값: 진행중
      
      // TODO: 필요한 다른 필드(repoUrl, demoUrl 등) 추가
    };

    try {
      // 새 프로젝트 생성 (POST 요청)
      const response = await api.post(`/api/projects`, dto); 
      const newProject = response.data;
      navigate(`/projects/${newProject.id}`); // 생성된 프로젝트 상세 페이지로 이동
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" && err.response.data) ||
        err.message ||
        "Failed to create project";
      if (err?.response?.status === 401) {
        setError("프로젝트를 생성하려면 로그인해야 합니다.");
      } else {
        setError(msg);
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
        <div className="container mx-auto p-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">새 프로젝트 등록</h2>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">제목 <span className="text-red-500">*</span></label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
                maxLength={140}
                placeholder="프로젝트 제목을 입력하세요."
              />
            </div>
            
            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block mb-2 font-semibold text-gray-700">요약</label>
              <input
                id="summary"
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg"
                maxLength={400}
                placeholder="프로젝트를 한 줄로 설명해주세요."
              />
            </div>
            
            {/* Description (Markdown) */}
            <div>
              <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">상세 설명 (Markdown)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg h-40 resize-y"
                placeholder="# 프로젝트 상세 설명&#10;&#10;마크다운 문법으로 작성할 수 있습니다."
              />
            </div>
            
            {/* Start/End Date */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block mb-2 font-semibold text-gray-700">시작 날짜 <span className="text-red-500">*</span></label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate} // 🌟 오늘 날짜가 기본값
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block mb-2 font-semibold text-gray-700">종료 날짜</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            </div>

            {/* Visibility & Status (예시) */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="visibility" className="block mb-2 font-semibold text-gray-700">공개 설정</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg"
                    >
                        <option value="public">Public (공개)</option>
                        <option value="private">Private (비공개)</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="status" className="block mb-2 font-semibold text-gray-700">진행 상태</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg"
                    >
                        <option value="진행중">진행중</option>
                        <option value="완료">완료</option>
                        <option value="계획중">계획중</option>
                    </select>
                </div>
            </div>

            {/* 미디어 및 기술 스택 추가 섹션은 TODO로 남겨둡니다. */}
            {/* TODO: 미디어 파일 업로드 및 관리 UI */}
            {/* TODO: 기술 스택 추가/선택 UI */}


            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 transition duration-150 shadow-md disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "프로젝트 등록 중..." : "프로젝트 등록"}
                </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default CreateProject;