import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import OAuthRedirectPage from "./pages/OAuthRedirectPage";
import ProjectDetails from "./pages/projectDetail";

/**
 * URL 경로에 따라 어떤 페이지를 보여줄지 결정 (라우터 설정)
 */
const App = () => {
  return (
    <Routes>
      {/* "/" (메인) 경로 접속 시 <HomePage>를 보여줌 */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/project" element={<ProjectDetails />} />

      {/* "/oauth-redirect" 경로 접속 시 <OAuthRedirectPage>를 보여줌 */}
      <Route path="/oauth-redirect" element={<OAuthRedirectPage />} />
    </Routes>
  );
};

export default App;
