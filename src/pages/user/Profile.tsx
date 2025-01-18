import { DescriptionSection } from "@/components/Descriptionsection";
import { ProfileCard } from "@/components/profileCard";
import { SkillsSection } from "@/components/skillsSection";
import Layout from "@/layout/Sidebar";

export const Profile = () => {
  const user = {
    profile: "profile img",
    firstName: "John",
    secondName: "Doe",
    role: "User",
    language: "English",
    country: "USA",
    phone: "+1 123 456 7890",
    description: "I am a user of ExpenX, managing personal expenses efficiently.",
    email: "johndoe@example.com",
    skills: ["Budgeting", "Expense Tracking", "Financial Planning"],
  };

  return (
    <Layout role="user">
      <section className="bg-gray-100 fade-in">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 px-4">
            <div className="lg:col-span-3">
              <ProfileCard user={user} />
              {/* <SkillsSection skills={user.skills} /> */}
            </div>
            <div className="lg:col-span-6 bg-white shadow rounded-lg p-6">
              <DescriptionSection description={user.description} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
