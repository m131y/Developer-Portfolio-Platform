import FAB from "../ui/FAB";

const Layoutcopy = ({ children, className }) => {
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
      <FAB />
    </div>
  );
};

export default Layoutcopy;
