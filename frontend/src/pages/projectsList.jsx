import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// 1. 페이지당 보여줄 아이템 개수 상수
const PAGE_SIZE = 10;

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. 페이지네이션을 위한 상태 추가 (UI는 1페이지부터 시작)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 3. API 요청 시 페이지 파라미터 추가 (Spring Pageable은 0-based)
        const pageParam = currentPage - 1;
        const res = await api.get(
          `/api/projects?page=${pageParam}&size=${PAGE_SIZE}`
        );

        console.log(res); // 응답 구조 확인 (e.g., { content: [], totalPages: 5, ... })

        // 4. Spring Page<> 응답에 맞춰 상태 업데이트
        setProjects(res.data.content); // 실제 데이터
        setTotalPages(res.data.totalPages); // 전체 페이지 수
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentPage]); // 5. currentPage가 바뀔 때마다 useEffect 재실행

  // 페이지 번호 버튼 클릭 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지네이션 버튼 렌더링 함수
  const renderPagination = () => {
    if (totalPages <= 1) return null; // 페이지가 1개 이하면 렌더링 안 함

    return (
      <nav className="flex justify-center items-center space-x-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </nav>
    );
  };

  if (error) {
    return (
      <Layout>
        <Header />
        <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
          <div className="container mx-auto p-4 text-red-500">
            Error: {error}
          </div>
        </main>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
        <div className="container mx-auto p-4">
          {/* Create Project 버튼을 상단으로 이동 (선택 사항) */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Link
              to="/projects/new"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Project
            </Link>
          </div>

          {loading && projects.length === 0 ? ( // 첫 로드 시에만 Loading... 표시
            <p>Loading...</p>
          ) : (
            <>
              <ul>
                {projects.map((p) => (
                  <li key={p.id} className="border-b py-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-blue-500 hover:underline font-semibold"
                    >
                      {p.title}
                    </Link>
                    {/* // NOTE: 백엔드 DTO에 summary가 포함되어 있어야 합니다.
                    // {p.summary && <p className="text-gray-600">{p.summary}</p>} 
                    */}
                    {/* // description을 요약해서 보여주는 예시 */}
                    {p.description && (
                      <p className="text-gray-600 truncate">
                        {p.description.substring(0, 100)}
                        {p.description.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              {/* 6. 페이지네이션 UI 렌더링 */}
              {renderPagination()}

              {/* // "Create Project" 버튼의 원래 위치
              <Link
                to="/projects/new"
                className="bg-blue-500 text-white px-4 py-2 mt-4 inline-block rounded hover:bg-blue-600"
              >
                Create Project
              </Link> 
              */}
            </>
          )}
        </div>
      </main>
      <Footer />
    </Layout>
  );
};

export default ProjectsList;