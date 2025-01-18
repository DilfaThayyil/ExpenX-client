import { DescriptionSection } from "@/components/Descriptionsection";
import { ProfileCard } from "@/components/profileCard";
import { SkillsSection } from "@/components/skillsSection";
import Layout from "@/layout/Sidebar";

export const ProfileAd = () =>{
    const advisor = {
    profile: "profile img",
    firstName: "Jane",
    secondName: "Smith",
    role: "Financial Advisor",
    language: "English",
    country: "Canada",
    phone: "+1 987 654 3210",
    description:
      "As a certified financial advisor, I specialize in helping individuals and businesses achieve their financial goals.",
    email: "janesmith@example.com",
    skills: ["Investment Planning", "Tax Optimization", "Debt Management"],
  };

  return (
    <Layout role="advisor">
      <section className="bg-gray-100 fade-in">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 px-4">
            <div className="lg:col-span-3">
              <ProfileCard user={advisor} />
              <SkillsSection skills={advisor.skills} />
            </div>
            <div className="lg:col-span-6 bg-white shadow rounded-lg p-6">
              <DescriptionSection description={advisor.description} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
