import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/");
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <header className="navigation w-full max-w-[1440px] mx-auto h-[124px] bg-white flex items-center justify-between px-[60px] absolute top-0">
      <button onClick={goToHomePage}>
        <div className="dev-foilio font-presentation text-black text-[24px] font-bold leading-[150%]">
          DevFoilio
        </div>
      </button>
      <nav className="items flex space-x-9 items-center h-[52px]">
        <div className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600">
          프로젝트
        </div>
        <div className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600">
          협업
        </div>
        <div className="div font-presentation text-black text-[15px] font-medium leading-[150%] cursor-pointer hover:text-gray-600">
          멘토링
        </div>

        <button
          onClick={goToLoginPage}
          className="button cursor-pointer bg-black rounded-md py-[10.5px] px-[18px] flex items-center justify-center shadow-sm hover:opacity-90 transition"
        >
          <div className="div2 font-presentation text-white text-[12px] font-medium leading-[150%]">
            로그인
          </div>
        </button>
      </nav>
    </header>
  );
};
export default Header;
