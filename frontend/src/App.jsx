// frontend/src/App.jsx (라우터 파일)

import React from "react";
import { Routes, Route } from "react-router-dom";
// TODO: MainLayout 컴포넌트 경로를 확인하세요! (components/layouts 폴더에 있다고 가정)
import MainLayout from "./components/layouts/MainLayout";

import Home from "./pages/home";
import Login from "./pages/login";
import OAuthRedirectPage from "./pages/OAuthRedirectPage";
import ProjectsList from "./pages/projectsList";
import CreateProjects from "./pages/createProjects";
import ProjectDetails from "./pages/projectDetail";
import UserProfileEdit from "./pages/UserProfileEdit"; // 님의 작업 파일 import

/**
 * URL 경로에 따라 어떤 페이지를 보여줄지 결정 (라우터 설정)
 */
const App = () => {
  return (
    <Routes>
      {/* 🚨 [핵심 수정]: MainLayout으로 감싸서 Header/Footer를 포함시킵니다. */}
      {/* Home 페이지 */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      {/* 프로젝트 관련 페이지 */}
      <Route
        path="/projects"
        element={
          <MainLayout>
            <ProjectsList />
          </MainLayout>
        }
      />
      <Route
        path="/projects/new"
        element={
          <MainLayout>
            <CreateProjects />
          </MainLayout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <MainLayout>
            <ProjectDetails />
          </MainLayout>
        }
      />

      {/* 프로필 수정 페이지 */}
      <Route
        path="/profile/edit"
        element={
          <MainLayout>
            <UserProfileEdit />
          </MainLayout>
        }
      />

      {/* 로그인 및 OAuth 리다이렉트 페이지 (Header/Footer 제외) */}
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-redirect" element={<OAuthRedirectPage />} />
    </Routes>
  );
};

export default App;
