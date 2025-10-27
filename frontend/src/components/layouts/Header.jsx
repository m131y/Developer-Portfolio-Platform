// frontend/src/components/layouts/Header.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// TODO: StorageService 경로를 실제 경로에 맞게 수정하세요.
import StorageService from "../../services/storage";
import { User as UserIcon } from "lucide-react"; // 🚨 lucide-react 아이콘 임포트 (Footer에도 아이콘이 있으므로 User로 이름 변경)

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 로드 시, 로컬 스토리지에서 토큰을 확인하여 로그인 상태 업데이트
  useEffect(() => {
    const token = StorageService.getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    StorageService.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true });
    window.location.reload(); // 확실한 상태 초기화를 위해 새로고침
  };

  // 프로필/로그인 클릭 핸들러
  const handleProfileClick = () => {
    if (isLoggedIn) {
      // 로그인 상태: 프로필 편집 페이지로 이동
      navigate("/profile/edit");
    } else {
      // 로그아웃 상태: 로그인 페이지로 이동
      navigate("/login");
    }
  };

  return (
    // 🚨 [수정]: 겹침을 유발하는 absolute top-0 제거. 대신 sticky 또는 일반 block 요소 사용
    <header className="navigation w-full max-w-[1440px] mx-auto h-[124px] bg-white flex items-center justify-between px-[60px] sticky top-0 z-10 border-b border-gray-200 shadow-sm">
      <Link
        to="/"
        className="dev-foilio font-presentation text-black text-[24px] font-bold leading-[150%]"
      >
        DevFoilio
      </Link>

      <nav className="items flex space-x-9 items-center h-[52px]">
        {/* 메인 네비게이션 링크 */}
        <Link
          to="/projects"
          className="font-presentation text-black text-[15px] font-medium cursor-pointer hover:text-gray-600"
        >
          프로젝트
        </Link>
        <Link
          to="/collaboration"
          className="font-presentation text-black text-[15px] font-medium cursor-pointer hover:text-gray-600"
        >
          협업
        </Link>
        <Link
          to="/mentoring"
          className="font-presentation text-black text-[15px] font-medium cursor-pointer hover:text-gray-600"
        >
          멘토링
        </Link>

        {/* 🚨 구분선 */}
        <div className="w-[1px] h-6 bg-gray-300 mx-3"></div>

        {/* 🚨 사용자 액션 영역 */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* 1. 로그인 상태: 프로필 아이콘 */}
            <button
              onClick={handleProfileClick}
              className="text-gray-700 hover:text-black transition p-2"
              title="프로필 수정"
            >
              <UserIcon className="w-5 h-5" /> {/* lucide-react 아이콘 사용 */}
            </button>

            {/* 2. 로그인 상태: 로그아웃 버튼 (피그마 디자인 색상) */}
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-slate-500 rounded-md py-[10.5px] px-[18px] flex items-center justify-center shadow-sm hover:bg-slate-600 transition"
            >
              <div className="text-white text-[12px] font-medium">로그아웃</div>
            </button>
          </div>
        ) : (
          // 3. 로그아웃 상태: 로그인 버튼
          <button
            onClick={handleProfileClick}
            className="cursor-pointer bg-black rounded-md py-[10.5px] px-[18px] flex items-center justify-center shadow-sm hover:opacity-90 transition"
          >
            <div className="text-white text-[12px] font-medium">로그인</div>
          </button>
        )}
      </nav>
    </header>
  );
};
export default Header;