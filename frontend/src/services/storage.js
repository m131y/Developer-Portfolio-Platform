const StorageKeys = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

const StorageService = {
  // getAccessToken: () => localStorage.getItem(StorageKeys.ACCESS_TOKEN),
  getAccessToken() {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("accessToken");
      return null;
    }
    return token;
  },
  setAccessToken: (token) =>
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, token),
  getRefreshToken: () => localStorage.getItem(StorageKeys.REFRESH_TOKEN),
  setRefreshToken: (token) =>
    localStorage.setItem(StorageKeys.REFRESH_TOKEN, token),
  getUser: () => {
    // const user = localStorage.getItem(StorageKeys.USER);
    // return user ? JSON.parse(user) : null;
    const raw = localStorage.getItem(StorageKeys.USER);
    if (!raw) return null;
    if (raw === "undefined" || raw === "null") {
      localStorage.removeItem(StorageKeys.USER);
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(StorageKeys.USER);
      return null;
    }
  },
  // setUser: (user) =>
  //   localStorage.setItem(StorageKeys.USER, JSON.stringify(user)),
  // clear: () => {
  //   Object.values(StorageKeys).forEach((key) => {
  //     localStorage.removeItem(key);
  //   });
  // },
  setUser(userObj) {
    if (userObj || userObj !== "object") {
      localStorage.removeItem(StorageKeys.USER);
      return;
    }
    localStorage.setItem(StorageKeys.USER, JSON.stringify(userObj));
  },
};

export default StorageService;
