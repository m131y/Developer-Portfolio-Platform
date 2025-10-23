import React from "react";

const Button = ({ children, className = "", onClick, type = "button" }) => {
  // 1. 기본 스타일 :
  // - Rounded, 그림자, 호버 효과, 커서 모양 등 공통 스타일
  // - 요청하신 기본 색상 (검정색 배경, 흰색 텍스트)
  const baseClasses =
    "bg-black text-white hover:bg-gray-800 transition duration-200 cursor-pointer shadow-sm";

  // 2. 요청하신 디자인 값 :
  // - 패딩, 둥근 모서리, 폰트 스타일, 중앙 정렬
  const designClasses =
    "rounded-[7.2px] font-presentation font-medium leading-[150%] " +
    "flex items-center justify-center";

  // 최종 클래스는 기본, 디자인, 크기, 그리고 외부에서 받은 클래스를 모두 합칩니다.
  const finalClasses = `${baseClasses} ${designClasses}  ${className}`;

  return (
    <button
      type={type} // form 제출 시 필요
      onClick={onClick}
      className={finalClasses}
    >
      {/* children을 직접 렌더링합니다. (div로 감쌀 필요 없음) */}
      {children}
    </button>
  );
};

export default Button;
