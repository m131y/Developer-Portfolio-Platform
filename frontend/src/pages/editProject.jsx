import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

// 날짜 형식을 "YYYY-MM-DD"로 변환하는 헬퍼 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
};

// 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환하는 헬퍼 함수
const getTodayDateString = () => {
  return formatDate(new Date());
};

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
  
  // 미디어 관련 상태 추가
  const [media, setMedia] = useState([]);
  
  // TechStacks 관련 상태 추가 (수정 페이지에서는 보통 초기화 로직이 필요합니다)
  const [techStacks, setTechStacks] = useState([]); 

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await api.get(`/api/projects/${id}`);
        const data = response.data;

        setTitle(data.title || "");
        setSummary(data.summary || "");
        setDescription(data.descriptionMd || "");

        // 요청 사항 1: 날짜가 없으면 오늘 날짜를 기본값으로 설정
        // 기존 값이 있으면 그 값을, 없으면 오늘 날짜를 YYYY-MM-DD 형식으로 설정
        setStartDate(formatDate(data.startDate) || getTodayDateString());
        setEndDate(formatDate(data.endDate) || ""); // 종료일은 필수가 아닐 수 있으므로 그대로 둠

        // 요청 사항 2: 미디어 및 TechStack 정보 설정
        setMedia(data.media || []);
        setTechStacks(data.techStacks || []);

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
    
    // API에 전송할 DTO 구성
    const dto = {
      title,
      summary: summary || null,
      descriptionMd: description || null,
      // startDate를 전송할 때는 YYYY-MM-DD가 아닌, API가 요구하는 ISO 8601 포맷으로 다시 변환해야 할 수 있습니다.
      // 여기서는 일단 YYYY-MM-DD 문자열로 전송한다고 가정합니다.
      startDate: startDate || null, 
      endDate: endDate || null,
      // 미디어와 TechStacks는 업데이트 로직이 복잡하므로, 
      // 현재는 API가 지원하는 형태 그대로 전송한다고 가정합니다.
      media, 
      techStacks, 
      
      // TODO: 기타 필드 (ownerId, visibility, status 등) 필요 시 추가
    };

    try {
      // 프로젝트 업데이트 (PUT 요청)
      const response = await api.put(`/api/projects/${id}`, dto); 
      const updated = response.data;
      navigate(`/projects/${updated.id}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" && err.response.data) ||
        err.message ||
        "Failed to update project";
      if (err?.response?.status === 401) {
        setError("Please log in to edit this project.");
      } else {
        setError(msg);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <Header />
        <main className="w-full flex-grow flex flex-col items-center justify-center mt-[140px] py-10">
          Loading...
        </main>
        <Footer />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header />
        <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
          <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
        </main>
        <Footer />
      </Layout>
    );
  }


  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
        <div className="container mx-auto p-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">프로젝트 수정: {title || id}</h2>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
                maxLength={140}
              />
            </div>
            
            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block mb-2 font-semibold text-gray-700">Summary</label>
              <input
                id="summary"
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg"
                maxLength={400}
              />
            </div>
            
            {/* Description (Markdown) */}
            <div>
              <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">Description (Markdown)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg h-40 resize-y"
              />
            </div>
            
            {/* Start/End Date */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block mb-2 font-semibold text-gray-700">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate} // 오늘 날짜가 이미 기본값으로 설정됨
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block mb-2 font-semibold text-gray-700">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>
            </div>

            {/* Media Gallery (요청 사항 2: 미디어 가져오는 부분 추가) */}
            <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">미디어 갤러리</h3>
                <div className="grid grid-cols-2 gap-4">
                    {media.length > 0 ? (
                        media.map((item, index) => (
                            <div key={item.id || index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                                {item.type === 'image' && (
                                    <img
                                        src={item.url}
                                        alt={`Media ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                {/* TODO: 여기서 미디어를 추가/삭제/수정하는 UI가 필요합니다. */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <span className="text-white text-sm p-2 bg-red-600 rounded cursor-pointer">삭제</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-2 text-gray-500">등록된 미디어가 없습니다. (미디어 추가 UI 필요)</p>
                    )}
                </div>
            </div>
            
            {/* Tech Stacks (Tech Stack 정보 표시) */}
            {techStacks.length > 0 && (
                <div className="border-t pt-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">기술 스택</h3>
                    <div className="flex flex-wrap gap-2">
                        {techStacks.map((tech) => (
                            <span
                                key={tech.id || tech.name}
                                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                    {/* TODO: Tech Stack 수정/추가 UI 필요 */}
                </div>
            )}


            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                >
                    Save Changes
                </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default EditProject;