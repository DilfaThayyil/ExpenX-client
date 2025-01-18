interface SkillsSectionProps {
    skills: string[];
  }
  
  export const SkillsSection = ({ skills }: SkillsSectionProps) => (
    <article className="bg-white shadow rounded-lg p-6">
      <div className="flex mb-4">
        <p className="text-gray-700 font-semibold">Skills</p>
      </div>
      <div className="max-w-full overflow-hidden">
        {skills.map((skill, index) => (
          <p
            key={index}
            className="bg-blue-50 inline-block px-2 py-1 text-gray-700 ms-2 mt-2"
          >
            {skill}
          </p>
        ))}
      </div>
    </article>
  );
  