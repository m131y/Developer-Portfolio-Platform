import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StorageService from "../../services/storage";

const Header = () => {
  const navigate = useNavigate();

  //log in & user detail status
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(StorageService.getAccessToken())
  );
  const [user, setUser] = useState(() => StorageService.getUser());

  //when mount component, Synchronize with local storage
  useEffect(() => {
    setIsLoggedIn(Boolean(StorageService.getAccessToken()));
    setUser(StorageService.getUser());
  }, []);

  useEffect(() => {
    //다른 탭/리다이렉트 저장소 변화 반영
    const onStorage = () => {
      setIsLoggedIn(Boolean(StorageService.getAccessToken()));
      setUser(StorageService.getUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);


  const goToLoginPage = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    StorageService.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navigation w-full max-w-[1440px] mx-auto h-[124px] bg-white flex items-center justify-between px-[60px] absolute top-0">
      <Link
        to="/"
        className="dev-foilio font-presentation text-black text-[24px] font-bold leading-[150%]"
      >
        DevFoilio
      </Link>
      <nav className="items flex space-x-9 items-center h-[52px]">
        <Link
          to="/projects"
          className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600"
        >
          프로젝트
        </Link>
        <Link
          to="/collaboration"
          className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600"
        >
          협업
        </Link>
        <Link
          to="/mentoring"
          className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600"
        >
          멘토링
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Link to="/user/profile" title="내 정보 보기">
              <span className="font-presentation text-black text-[15px]">
                {user?.nickname || user?.name || user?.email || "내 정보"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-black text-white rounded-md py-2 px-3"
            >
              <div className="div2 font-presentation text-white text-[12px] font-medium leading-[150%]">
                로그아웃
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={goToLoginPage}
            className="button cursor-pointer bg-black rounded-md py-[10.5px] px-[18px] flex items-center justify-center shadow-sm hover:opacity-90 transition"
          >
            <div className="div2 font-presentation text-white text-[12px] font-medium leading-[150%]">
              로그인
            </div>
          </button>
        )}
      </nav>
    </header>
  );
};
export default Header;
