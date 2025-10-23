import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";
import Button from "../components/ui/Button";

const Home = () => {
  return (
    <Layout>
      <Header />

      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10">
        {/* 모든 콘텐츠를 감싸는 최대 너비 래퍼 */}
        <div className="w-full max-w-[1296px] flex flex-col items-center space-y-24">
          {/* 1. Hero Section - 콘텐츠를 690px 기준으로 중앙 정렬 */}
          {/* 섹션 자체에는 너비 제약이 없지만, 내부 콘텐츠는 690px로 중앙 정렬됨 */}
          <section className="w-full flex flex-col items-center justify-start space-y-10">
            {/* copy2: w-[690px]를 중앙 정렬 */}
            <div className="copy2 w-[690px] flex flex-col gap-9 items-start justify-start mx-auto">
              <div className="page-title w-full flex flex-col gap-[2.6px] items-start">
                <h1 className="dev-folio3 font-aggravo text-black text-[36px] font-bold tracking-[-0.02em]">
                  당신의 포트폴리오, DevFolio
                </h1>
                <p className="div10 font-noto text-[14.4px] text-gray-500/75 font-normal leading-[140%]">
                  프로젝트를 업로드하고 관리하세요. 협업과 멘토링까지 한곳에서.
                </p>
              </div>
              <Button className="py-[18px] px-[28.8px] w-[180px] h-[54px]">
                <div className="div11 font-noto text-white text-[14.4px] font-medium leading-[150%]">
                  지금 시작하기
                </div>
              </Button>
            </div>

            {/* hero-image 컨테이너는 이미 flex justify-center로 중앙 정렬 중 */}
            <div className="w-full flex justify-center">
              <div
                className="hero-image w-[53.24%] h-[276px] rounded-[7.2px] overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(48.24deg, #F695FF 0%, #238378 51.76%, #554C96 100%)",
                }}
              >
                <div
                  className="dev-folio2 text-white text-[72px] font-extrabold leading-[150%] opacity-70 absolute top-[292.5px] left-[50%] -translate-x-[50%]"
                  style={{ transform: "rotate(-90deg) translate(-292.5px, 0)" }}
                >
                  DevFolio
                </div>
              </div>
            </div>
          </section>

          {/* 2. Popular Projects Section - 고정 너비 690px 섹션 중앙 정렬 */}
          <section className="frame-2610306 w-[690px] h-[349.2px] flex flex-col mt-10 items-center justify-start space-y-5 mx-auto">
            {/* .div9: self-start가 있지만 부모가 690px로 고정되어 있어 좌측 정렬됨 */}
            <h2 className="div9 font-presentation text-black text-[28.8px] font-extrabold tracking-[-0.02em] w-[470px] text-left self-start">
              인기 프로젝트
            </h2>

            {/* .cards2: w-[690px]로 고정되어 있으며 flex로 두 카드 배치 */}
            <div className="cards2 w-[690px] h-[305px] flex space-x-[36.3px]">
              {/* .card (Project Card 1) */}
              <div className="card w-[326.7px] flex flex-col gap-[28.8px] items-start overflow-hidden">
                <div
                  className="image w-full h-[180.9px] rounded-[7.2px] overflow-hidden relative flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(123.52deg, #0653D0 0%, #50ACA4 68.75%, #36E965 100%)",
                  }}
                >
                  <div className="instagram-clone text-white text-[36px] font-extrabold justify-center">
                    Instagram Clone
                  </div>
                </div>
                <div className="copy w-full h-[55.8px] relative">
                  <h3 className="instagram-clone-project font-presentation text-black text-[18px] font-medium leading-[150%] absolute top-0 left-0">
                    Instagram Clone Project
                  </h3>
                  <p className="div8 font-presentation text-gray-500 text-[14.4px] font-normal leading-[150%] absolute top-[34.2px] left-0">
                    인스타그램 클론코딩
                  </p>
                </div>
              </div>

              {/* .card2 (Project Card 2) */}
              <div className="card w-[326.7px] flex flex-col gap-[28.8px] items-start overflow-hidden">
                <div
                  className="image w-full h-[180.9px] rounded-[7.2px] overflow-hidden relative flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(123.52deg, #0653D0 0%, #50ACA4 68.75%, #36E965 100%)",
                  }}
                >
                  <div className="instagram-clone text-white text-[36px] font-extrabold justify-center">
                    Developer Portfolio Platform
                  </div>
                </div>
                <div className="copy w-full h-[55.8px] relative">
                  <h3 className="instagram-clone-project font-presentation text-black text-[18px] font-medium leading-[150%] absolute top-0 left-0">
                    Developer Portfolio Platform
                  </h3>
                  <p className="div8 font-presentation text-gray-500 text-[14.4px] font-normal leading-[150%] absolute top-[34.2px] left-0">
                    개발자 포트폴리오 플랫폼
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Collaboration Section - 고정 너비 690px 섹션 중앙 정렬 */}
          <section className="frame-2610307 w-[690px] h-[340.2px] flex flex-col items-start space-y-5 mx-auto">
            {/* .div5: self-start가 있지만 부모가 690px로 고정되어 있어 좌측 정렬됨 */}
            <h2 className="div5 font-presentation text-black text-[28.8px] font-extrabold tracking-[-0.02em] mt-[56.7px]">
              협업 시작하기
            </h2>

            {/* .cards: w-[690px]로 고정되어 있으며 flex로 세 카드 배치 */}
            <div className="cards w-[690px] h-[121px] flex justify-start space-x-[15px]">
              {/* .customer-quote 1 */}
              <div className="customer-quote w-[220px] h-[121px] bg-white rounded-[9.37px] border border-[#e6e6e6] p-[24.99px] relative flex flex-col justify-between">
                <div className="react-frontend font-presentation text-black text-[13.58px] font-medium leading-[150%]">
                  java springboot 경험 있으신 분
                </div>
                <div className="avatar flex items-center space-x-[12.5px] mt-4">
                  <img
                    className="avatar2 w-[26.36px] h-[26.36px] rounded-full object-cover bg-gray-300"
                    src="avatar1.png"
                    alt="Avatar"
                  />
                  <div className="frame-2610301 flex flex-col gap-[1.17px]">
                    <div className="div6 font-presentation text-black text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      이름
                    </div>
                    <div className="div7 font-presentation text-[#828282] text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      설명
                    </div>
                  </div>
                </div>
              </div>

              {/* .customer-quote 2 */}
              <div className="customer-quote w-[220px] h-[121px] bg-white rounded-[9.37px] border border-[#e6e6e6] p-[24.99px] relative flex flex-col justify-between">
                <div className="react-frontend font-presentation text-black text-[13.58px] font-medium leading-[150%]">
                  React Frontend 개발자 구해요
                </div>
                <div className="avatar flex items-center space-x-[12.5px] mt-4">
                  <img
                    className="avatar2 w-[26.36px] h-[26.36px] rounded-full object-cover bg-gray-300"
                    src="avatar1.png"
                    alt="Avatar"
                  />
                  <div className="frame-2610301 flex flex-col gap-[1.17px]">
                    <div className="div6 font-presentation text-black text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      이름
                    </div>
                    <div className="div7 font-presentation text-[#828282] text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      설명
                    </div>
                  </div>
                </div>
              </div>

              {/* .customer-quote 3 */}
              <div className="customer-quote w-[220px] h-[121px] bg-white rounded-[9.37px] border border-[#e6e6e6] p-[24.99px] relative flex flex-col justify-between">
                <div className="react-frontend font-presentation text-black text-[13.58px] font-medium leading-[150%]">
                  팀원 모집
                </div>
                <div className="avatar flex items-center space-x-[12.5px] mt-4">
                  <img
                    className="avatar2 w-[26.36px] h-[26.36px] rounded-full object-cover bg-gray-300"
                    src="avatar1.png"
                    alt="Avatar"
                  />
                  <div className="frame-2610301 flex flex-col gap-[1.17px]">
                    <div className="div6 font-presentation text-black text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      이름
                    </div>
                    <div className="div7 font-presentation text-[#828282] text-[10px] font-medium leading-[11.72px] tracking-[0.06px]">
                      설명
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </Layout>
  );
};

export default Home;
