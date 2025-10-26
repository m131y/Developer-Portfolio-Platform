import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { api } from "../api";                  // axios 인스턴스
import StorageService from "../services/storage";
import Layout from "../components/layouts/MainLayout";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

export default function MyInfo() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 토큰이 없다면 로그인 페이지로
        if (!StorageService.getAccessToken()) {
          navigate("/login");
          return;
        }
        const res = await api.get("/api/users/me");
        setMe(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <Layout>
      <Header />
      <main className="max-w-[1200px] mx-auto w-full py-12 px-6">
        <h1 className="text-2xl font-bold mb-6">내 정보</h1>
        {loading && <p>불러오는 중…</p>}
        {err && <p className="text-red-600">에러: {String(err)}</p>}
        {!loading && !err && me && (
          <div className="space-y-3">
            <div><span className="font-semibold">닉네임: </span>{me.nickname || "-"}</div>
            <div><span className="font-semibold">이메일: </span>{me.email || "-"}</div>
            <div><span className="font-semibold">직무: </span>{me.job || "-"}</div>
            <div><span className="font-semibold">소개: </span>{me.bio || "-"}</div>
            <button onClick={() => navigate('/profile/edit')} className="mt-4 px-4 py-2 bg-black text-white rounded">프로필 수정</button>
          </div>
        )}
      </main>
      <Footer />
    </Layout>
  );
}
