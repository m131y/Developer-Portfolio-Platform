import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import Layout from "../components/layouts/MainLayout";

const ProfileEdit = () => {
  return (
    <Layout>
      <Header />
      <main className="w-full flex-grow flex flex-col items-center mt-[140px] py-10"></main>
      <Footer />
    </Layout>
  );
};

export default ProfileEdit;
