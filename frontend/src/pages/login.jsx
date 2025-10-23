import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";

/**
 * 1. 로그인 링크가 있는 메인 페이지 (경로: /)
 */
const Login = () => {
  // 백엔드의 소셜 로그인 URL
  const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";
  const GITHUB_AUTH_URL = "http://localhost:8080/oauth2/authorization/github";

  return (
    <Layout>
      <Header />
      // Tailwind CSS 클래스 사용
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4">소셜 로그인 테스트</h1>
          <p className="text-lg mb-8">
            아래 링크를 클릭하여 로그인을 테스트하세요.
          </p>

          {/* <a> 태그와 Tailwind 스타일 */}
          <a
            className="bg-white text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 mb-4 inline-block"
            href={GOOGLE_AUTH_URL}
          >
            Google로 로그인하기
          </a>
          <br />
          <a
            className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 inline-block"
            href={GITHUB_AUTH_URL}
          >
            GitHub로 로그인하기
          </a>
        </header>
      </div>
      <Footer />
    </Layout>
  );
};

export default Login;
