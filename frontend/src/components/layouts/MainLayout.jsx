const Layout = ({ children, className }) => {
  return (
    // 1. flex flex-col: 자식 요소(Header, Main, Footer)를 수직으로 배치
    // 2. min-h-screen: 최소 높이를 화면 전체로 설정 (스크롤 없어도 Footer가 바닥에 붙도록)
    <div
      className={`
        w-full 
        max-w-[1440px] 
        mx-auto 
        min-h-screen 
        bg-white 
        flex flex-col
        ${className} 
      `}
    >
      {/* children (Header, Main, Footer)을 그대로 렌더링 */}
      {children}

      <div
        className="fixed bottom-8 right-8 z-50 
                   w-14 h-14 rounded-full bg-blue-500 shadow-lg 
                   flex items-center justify-center cursor-pointer 
                   hover:bg-blue-600 transition-colors"
      >
        {/* 아이콘 (예: '+' 기호 또는 챗봇 아이콘) */}
        <span className="text-white text-3xl font-bold">+</span>
      </div>
    </div>
  );
};

export default Layout;
