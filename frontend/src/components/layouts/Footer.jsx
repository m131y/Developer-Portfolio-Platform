const Footer = () => {
  return (
    <footer className="navigation-footer w-full bg-white">
      {" "}
      <div className="w-full max-w-[1440px] mx-auto px-[60px] relative">
        <div className="divider border-t border-[#e6e6e6] absolute top-0 left-0 w-full"></div>
        <div className="flex justify-end pt-[40px] relative z-10">
          {" "}
          {/* pt-10을 40px로 명시 */}
          <div className="w-full flex justify-between items-start">
            {/* .dev-folio (Footer Logo) */}
            <div className="dev-folio font-presentation text-black text-lg font-normal leading-[150%]">
              DevFolio
            </div>

            <div className="flex space-x-[36px]">
              {/* .items2 (프로젝트) */}
              <div className="items2 w-[140.25px] flex flex-col gap-[18px] items-end justify-center">
                {" "}
                <div className="div3 font-presentation text-black text-[12px] font-medium leading-[150%]">
                  프로젝트
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  프로젝트 업로드
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
              </div>

              {/* .items3 (협업) */}
              <div className="items3 w-[140.25px] flex flex-col gap-[18px] items-end justify-start text-right">
                {" "}
                <div className="div3 font-presentation text-black text-[12px] font-medium leading-[150%]">
                  협업
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
                <div className="div4  font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
              </div>

              {/* .items4 (멘토링) */}
              <div className="items4 w-[140.25px] flex flex-col gap-[18px] items-end justify-start text-right">
                {" "}
                <div className="div3 font-presentation text-black text-[12px] font-medium leading-[150%]">
                  멘토링
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
                <div className="div4 font-presentation text-[#454545] text-[12px] font-medium leading-[150%] cursor-pointer hover:text-black">
                  페이지
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* .social-icons */}
        <div className="social-icons flex space-x-[6px] pb-[36px] pt-10">
          {" "}
          <div className="buttons-icon w-[30px] h-[30px] p-[6px] relative cursor-pointer hover:opacity-80">
            <img
              className="icon w-[18px] h-[18px]  top-[6px] left-[6px]"
              src="icon0.svg"
              alt="Social Icon 1"
            />
          </div>
          <div className="buttons-icon w-[30px] h-[30px] p-[6px] relative cursor-pointer hover:opacity-80">
            {" "}
            <img
              className="icon2 w-[18px] h-[18px]  top-[6px] left-[6px]"
              src="icon1.svg"
              alt="Social Icon 2"
            />
          </div>
          <div className="buttons-icon w-[30px] h-[30px] p-[6px] relative cursor-pointer hover:opacity-80">
            <img
              className="icon3 w-[18px] h-[18px]  top-[6px] left-[6px]"
              src="icon2.svg"
              alt="Social Icon 3"
            />
          </div>
          <div className="buttons-icon w-[30px] h-[30px] p-[6px] relative cursor-pointer hover:opacity-80">
            <img
              className="icon4 w-[18px] h-[18px] top-[6px] left-[6px]"
              src="icon3.svg"
              alt="Social Icon 4"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
