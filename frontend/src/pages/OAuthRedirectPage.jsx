import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * 2. 백엔드가 리다이렉트할 페이지 (경로: /oauth-redirect)
 */
const OAuthRedirectPage = () => {
  // URL의 쿼리 파라미터( ?token=... )를 읽어옴
  const [searchParams] = useSearchParams();

  // 'token'이라는 이름의 쿼리 파라미터 값을 가져옴
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      console.log("백엔드에서 JWT 토큰을 받았습니다:", token);

      // 토큰을 로컬 스토리지에 저장 (브라우저에 저장)
      localStorage.setItem("jwt_token", token);

      // (선택) 토큰 저장 후 메인 페이지로 이동시킬 수 있음
      // window.location.href = "/";
    }
  }, [token]); // token 값이 변경될 때만 실행

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <header className="text-center p-4">
        <h1 className="text-4xl font-bold mb-4">로그인 처리 중...</h1>
        {token ? (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl text-green-400 mb-4">로그인 성공! 🎉</h2>
            <p className="mb-2">
              발급받은 토큰 (F12 개발자 도구 Console 또는 Storage 확인):
            </p>
            {/* 토큰을 화면에 직접 표시 (테스트용) */}
            <p className="bg-gray-700 text-white p-4 rounded-lg break-all text-sm">
              {token}
            </p>
          </div>
        ) : (
          <p className="text-red-400">
            토큰을 받지 못했습니다. 로그인에 실패했습니다.
          </p>
        )}
      </header>
    </div>
  );
};

export default OAuthRedirectPage;
