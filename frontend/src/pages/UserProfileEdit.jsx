// frontend/src/pages/UserProfileEdit.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Plus,
  Minus,
  Github,
  Linkedin,
  Globe,
  FileText,
  MapPin,
  Briefcase,
  Clock,
  MessageCircleDashed as MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// 🚨 TODO: API 함수 경로를 님의 프로젝트 구조에 맞게 수정해주세요!
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserSocialLinks,
  updateUserTechStacks,
  uploadProfileImage,
} from "../services/userApi";

// 백엔드 LinkType Enum과 동일하게 정의 (예시)
const LinkType = {
  GITHUB: "GitHub",
  LINKEDIN: "LinkedIn",
  BLOG: "블로그",
  WEBSITE: "웹사이트",
};

const linkTypeIcons = {
  GITHUB: Github,
  LINKEDIN: Linkedin,
  BLOG: FileText,
  WEBSITE: Globe,
};

function UserProfileEdit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    job: "",
    experience: "",
    bio: "",
    location: "",
    profileImageUrl: null,
    socialLinks: [],
    techNames: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [availableTechs] = useState([
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "Spring Boot",
    "Django",
    "FastAPI",
    "Java",
    "Python",
    "Go",
    "Rust",
    "C++",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "Redis",
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 초기 데이터 로딩
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await fetchUserProfile();

        setFormData({
          nickname: userProfile.nickname || "",
          job: userProfile.job || "",
          experience: userProfile.experience || "",
          bio: userProfile.bio || "",
          location: userProfile.location || "",
          profileImageUrl: userProfile.profileImageUrl || null,
          socialLinks:
            userProfile.socialLinks?.map((link) => ({
              id: link.id,
              linkType: link.linkType,
              url: link.url,
            })) || [],
          techNames:
            userProfile.userTechStacks?.map((uts) => uts.techStack.techName) ||
            [],
        });
      } catch (err) {
        console.error("프로필 로딩 오류:", err);
        if (err.response && err.response.status === 401) {
          navigate("/login", { replace: true });
        }
        setError("프로필 정보를 불러오는데 실패했습니다.");
        toast.error("프로필 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, socialLinks: newLinks }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: null, linkType: "GITHUB", url: "" },
      ],
    }));
  };

  const removeSocialLink = (index) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, socialLinks: newLinks }));
  };

  const handleTechStackChange = (techName) => {
    setFormData((prev) => {
      const currentTechs = prev.techNames;
      if (currentTechs.includes(techName)) {
        return {
          ...prev,
          techNames: currentTechs.filter((t) => t !== techName),
        };
      } else {
        return { ...prev, techNames: [...currentTechs, techName] };
      }
    });
  };

  // 🚨 [수정된 핵심 로직]: 프로필 업데이트 및 내비게이션
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalImageUrl = formData.profileImageUrl;

      // A. 이미지 업로드: imageFile이 있을 경우에만 API 호출
      if (imageFile) {
        console.log("1. 프로필 이미지 업로드 시도...");
        const imageResponse = await uploadProfileImage(imageFile);
        finalImageUrl = imageResponse.profileImageUrl;
        console.log("1. 프로필 이미지 업로드 성공:", finalImageUrl);
      }

      // B. 기본 정보 업데이트
      console.log("2. 기본 정보 업데이트 시도...");
      const profileData = {
        nickname: formData.nickname,
        job: formData.job,
        experience: formData.experience,
        bio: formData.bio,
        location: formData.location,
        profileImageUrl: finalImageUrl,
      };
      await updateUserProfile(profileData);
      console.log("2. 기본 정보 업데이트 성공.");

      // C. 소셜 링크 업데이트
      console.log("3. 소셜 링크 업데이트 시도...");
      const linksData = formData.socialLinks.map(({ linkType, url }) => ({
        linkType,
        url,
      }));
      await updateUserSocialLinks(linksData);
      console.log("3. 소셜 링크 업데이트 성공.");

      // D. 기술 스택 업데이트
      console.log("4. 기술 스택 업데이트 시도...");
      const techsData = { techNames: formData.techNames };
      await updateUserTechStacks(techsData);
      console.log("4. 기술 스택 업데이트 성공.");

      // 모든 API 호출 성공
      toast.success("프로필이 성공적으로 업데이트되었습니다!");
      navigate("/"); // ✅ 최종 이동 (메인 페이지로)
    } catch (err) {
      // 🚨 오류 발생 시 상세 로그 출력 및 메시지 업데이트
      console.error(
        "❌ 프로필 업데이트 오류 발생! 상세:",
        err.message,
        err.response?.data
      );

      let errorMessage = "프로필 업데이트 중 오류가 발생했습니다.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // --- JSX 렌더링 (로딩/에러 상태) ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.nickname) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              오류 발생
            </h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- JSX 렌더링 (폼) ---
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          {/* 1. 프로필 헤더 섹션 */}
          <div className="px-8 py-12 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-8">
              <div className="relative">
                {/* 프로필 이미지/아이콘 */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-purple-300">
                  {formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-purple-600" />
                  )}
                </div>
                {/* 이미지 변경 버튼 아이콘 */}
                <label
                  htmlFor="profileImageInput"
                  className="absolute -bottom-1 -right-1 bg-purple-600 border-2 border-white rounded-full p-1 cursor-pointer hover:bg-purple-700 transition-colors shadow-md"
                >
                  <Camera className="w-4 h-4 text-white" />
                </label>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="pt-2">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  내 프로젝트를 관리해보세요
                </h1>
                <p className="text-base text-gray-600">
                  {formData.nickname || "사용자"} 님 (
                  {formData.job || "직무 미입력"})
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profileImageInput")?.click()
                  }
                  className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors hidden md:inline-block"
                >
                  이미지 변경
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12">
            {/* 2. 기본 정보 섹션 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-2 border-gray-100">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    닉네임 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="job"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Briefcase className="w-4 h-4 mr-1" />
                    직무
                  </label>
                  <input
                    type="text"
                    id="job"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="예: 프론트엔드 개발자"
                  />
                </div>
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    경력
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="예: 3년차, 신입"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    위치
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="예: 서울, 대한민국"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    소개
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    placeholder="자신을 간단히 소개해보세요"
                  />
                </div>
              </div>
            </section>

            {/* 3. 소셜 링크 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6 border-b pb-2 border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-600" />
                  소셜 링크
                </h2>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  링크 추가
                </button>
              </div>
              <div className="space-y-4">
                {formData.socialLinks.map((link, index) => {
                  const IconComponent = linkTypeIcons[link.linkType] || Globe;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <select
                          value={link.linkType}
                          onChange={(e) =>
                            handleSocialLinkChange(
                              index,
                              "linkType",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-32"
                        >
                          {Object.entries(LinkType).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <input
                          type="url"
                          placeholder="링크 URL을 입력하세요"
                          value={link.url}
                          onChange={(e) =>
                            handleSocialLinkChange(index, "url", e.target.value)
                          }
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {formData.socialLinks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>소셜 링크를 추가해보세요</p>
                  </div>
                )}
              </div>
            </section>

            {/* 4. 기술 스택 섹션 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-2 border-gray-100">
                <div className="w-5 h-5 mr-2 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  #
                </div>
                기술 스택
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTechs.map((tech) => (
                  <label
                    key={tech}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.techNames.includes(tech)
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.techNames.includes(tech)}
                      onChange={() => handleTechStackChange(tech)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">{tech}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                선택된 기술: {formData.techNames.length}개
              </div>
            </section>

            {/* 5. 저장/취소 버튼 */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex items-center space-x-4 ml-auto">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={saving}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </>
                  ) : (
                    "프로필 저장"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfileEdit;
