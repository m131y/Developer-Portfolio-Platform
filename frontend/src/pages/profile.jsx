import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { api } from "../api";                  // axios 인스턴스
import StorageService from "../services/storage";
import Layout from "../components/layouts/MainLayout";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    job: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      // 토큰이 없다면 로그인 페이지로
      if (!StorageService.getAccessToken()) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:8080/api/user");
        setMe(res.data);
        setFormData({
          nickname: res.data?.nickname || "",
          job: res.data?.job || "",
          bio: res.data?.bio || "",
        });
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        nickname: formData.neckname.trim(),
        job: formData.job.trim(),
        bio: formData.bio.trim(),
      };
      await axios.put("http://localhost:8080/api/user", payload, {
        headers: { "Content-Type": "application/json" },
      });
      // check after saving
      const res = await axios.get("http://localhost:8080/api/user");
      setMe(res.data);
      setEdit(false);
      // StorageService의 user도 업데이트
      StorageService.setUser({
        ...(StorageService.getUser() || {}),
        id: res.data?.id,
        email: res.data?.email,
        nickname: res.data?.nickname,
        job: res.data?.job,
        bio: res.data?.gio,
      });
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <Header />
      <main className="max-w-[1200px] mx-auto w-full py-30 px-6">
        <h1 className="text-2xl font-bold mb-6">내 정보</h1>
        {loading && <p>불러오는 중…</p>}
        {err && <p className="text-red-600">에러: {String(err)}</p>}

        {!loading && !err && me && (
          <div className="space-y-8">
            <div>
              <span className="font-semibold">ID: </span>
              {me.id || "-"}
            </div>
            <div>
              <span className="font-semibold">이메일: </span>
              {me.email || "-"}
            </div>
            {!edit ? (
              <>
                <div>
                  <span className="font-semibold">닉네임: </span>
                  {me.nickname || "-"}
                </div>
                <div>
                  <span className="font-semibold">직무: </span>
                  {me.job || "-"}
                </div>
                <div>
                  <span className="font-semibold">소개: </span>
                  {me.bio || "-"}
                </div>
                <button
                  onClick={() => setEdit(true)}
                  className="mt-4 px-4 py-2 bg-black text-white rounded"
                >
                  프로필 수정
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block mb-1 font-semibold">닉네임</label>
                  <input
                    name="nickname"
                    value={formData.nickname}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">직무</label>
                  <input
                    name="job"
                    value={formData.job}
                    onChange={onChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">소개</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={onChange}
                    className="w-full border rounded p-2 h32"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={save}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Submit"}
                  </button>
                  <button
                    onClick={() => {
                      setEdit(false);
                      setFormData({
                        nickname: me?.nickname || "",
                        job: me?.job || "",
                        bio: me?.bio || "",
                      });
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </Layout>
  );
};

export default Profile;
