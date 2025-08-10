import WeeklySlide from "@/app/_components/weekly-slides/WeeklySlide";
import UserProfileSection from "../_components/user-profile-section/UserProfileSection";

const MainPage: React.FC = () => {
  return (
    <main>
      <UserProfileSection />
      <WeeklySlide />
    </main>
  );
};

export default MainPage;
