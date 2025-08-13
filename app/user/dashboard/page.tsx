import React from "react";
import UserProfileSection from "../../_components/user-profile-section/UserProfileSection";
import ChallengeListSection from "./_components/ChallengeListSection";

const MainPage: React.FC = () => {
  return (
    <main className="px-2 py-2">
      <UserProfileSection />
      <ChallengeListSection />
    </main>
  );
};

export default MainPage;
