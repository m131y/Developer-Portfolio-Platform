// frontend/src/pages/OAuthRedirectPage.jsx

import React, { useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import StorageService from "../services/storage"; // StorageService import 경로 확인

const OAuthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); // URL을 분석하는 데 사용

  // URL에서 'token' 파라미터를 가져옵니다.
  const token = searchParams.get("token");
  // URL에 'error' 파라미터가 있는지 확인합니다. (로그인 실패 시)
  const error = searchParams.get("error");

  useEffect(() => {
    if (token) {
      console.log("JWT 토큰 저장 완료:", token);

      // 1. 토큰 저장
      StorageService.setAccessToken(token);

      // 2. 🚨 [핵심] 토큰 저장 후, 메인 페이지로 이동합니다.
      //    Header 컴포넌트는 메인 페이지에서 토큰을 읽어 UI를 프로필 아이콘으로 변경할 것입니다.
      navigate("/", { replace: true });
    } else if (error) {
      // 3. 토큰 대신 에러 파라미터가 있다면 로그인 실패 처리
      console.error("OAuth 로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
      navigate("/login", { replace: true });
    } else {
      // 4. 토큰도 에러도 없다면, 경로가 잘못된 것으로 간주하고 로그인 페이지로 리다이렉트
      navigate("/login", { replace: true });
    }
    // 의존성 배열에 navigate와 location (혹은 searchParams)을 포함합니다.
  }, [token, error, navigate]);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <header className="text-center p-4">
        <h1 className="text-4xl font-bold mb-4">로그인 처리 중...</h1>
        <p>자동으로 이동하지 않으면 새로고침해주세요.</p>
      </header>
    </div>
  );
};

export default OAuthRedirectPage;
