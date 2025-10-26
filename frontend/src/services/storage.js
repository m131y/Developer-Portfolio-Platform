const StorageKeys = {
  ACCESS_TOKEN: "jwt_token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};

const StorageService = {

  // getAccessToken: () => localStorage.getItem(StorageKeys.ACCESS_TOKEN),
  getAccessToken() {
    const token = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
      return null;
    }
    return token;
  },
  // setAccessToken: (token) =>
  //   localStorage.setItem(StorageKeys.ACCESS_TOKEN, token),
  setAccessToken(token) {
    if (!token) localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, token);
  },

  // getRefreshToken: () => localStorage.getItem(StorageKeys.REFRESH_TOKEN),
  getRefreshToken() {
    const token = localStorage.getItem(StorageKeys.REFRESH_TOKEN);
    if(!token || token === "undefined" || token === "null"){
      localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
      return null;
    }
    return token;
  },
  // setRefreshToken: (token) =>
  //   localStorage.setItem(StorageKeys.REFRESH_TOKEN, token),
  setRefreshToken(token) {
    if (!token) localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
    else localStorage.setItem(StorageKeys.REFRESH_TOKEN, token);
  },

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

  clear() {
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(StorageKeys.USER)
    localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
    localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
  }
};

export default StorageService;
