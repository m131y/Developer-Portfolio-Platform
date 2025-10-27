// frontend/src/services/userApi.js

import api from "./api";

const USER_BASE_URL = "/api/user/profile";

// 1. 프로필 정보 조회 (GET /api/user/profile)
export const fetchUserProfile = async () => {
  try {
    // api.get()을 사용하면 api.js에 설정된 기본 URL과 인터셉터가 적용됩니다.
    const response = await api.get(USER_BASE_URL);
    return response.data;
  } catch (error) {
    throw error; // 에러를 상위 컴포넌트로 던져서 처리
  }
};

// 2. 기본 프로필 정보 수정 (PUT /api/user/profile)
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put(USER_BASE_URL, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. 소셜 링크 수정 (PUT /api/user/profile/links)
export const updateUserSocialLinks = async (linksData) => {
  try {
    const response = await api.put(`${USER_BASE_URL}/links`, linksData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. 기술 스택 수정 (PUT /api/user/profile/techstacks)
export const updateUserTechStacks = async (techsData) => {
  try {
    const response = await api.put(`${USER_BASE_URL}/techstacks`, techsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 5. 이미지 업로드 (POST /api/user/profile/image)
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post(`${USER_BASE_URL}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 파일 업로드 형식 명시
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
